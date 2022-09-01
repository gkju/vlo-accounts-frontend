import {createMinimalistModal} from "../Authed/Pages/AccountManagement";
import {
    Fido2NetLibAssertionOptions,
    Fido2NetLibCredentialCreateOptions,
    FidoApi
} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../../Config";
import {instance} from "../Authed/Mutations";
import {useNavigate} from "react-router-dom";
import authService from "../../Auth/AuthService";
import {NavigateToReturnUrl} from "../ReturnUrlUtils";
import {GetReturnUrl} from "../../Utils";

export const fidoLogin = async () => {
    createMinimalistModal({
       placeholder: 'Nazwa użytkownika' ,
        handler: async (input: string) => {
            await fidoLoginNoRegister(input);
        },
        validator: (input: string) => {

        }
    });
}

export const fidoAdd = async () => {
    let api = new FidoApi(OpenApiSettings, "", instance);
    let attType = "none";
    let authType = "";
    let userVerification = "preferred";
    let requireResidentKey = false;
    let opts = (await api.makeCredentialOptionsPost({
        attType,
        authType,
        userVerification,
        requireResidentKey,
        userName: "no"
    })).data;
    await handleOpts(opts);
}

export const fidoRegister = async (userName: string, email: string, captchaResponse: string) => {
    let attType = "none";
    let authType = "";
    let userVerification = "preferred";
    let requireResidentKey = false;
    let api = new FidoApi(OpenApiSettings, "", instance);
    let opts = (await api.fidoRegisterUserPost({
        userName,
        email,
        attType,
        authType,
        userVerification,
        requireResidentKey,
        captchaResponse
    })).data;
    await handleOpts(opts);
}

const handleOpts = async (opts: Fido2NetLibCredentialCreateOptions) => {
    let api = new FidoApi(OpenApiSettings, "", instance);
    let makeCredentialOptions: any = {};
    Object.assign(makeCredentialOptions, opts);
    makeCredentialOptions.challenge = coerceToArrayBuffer(makeCredentialOptions.challenge);
    makeCredentialOptions.user.id = coerceToArrayBuffer(makeCredentialOptions.user.id);

    makeCredentialOptions.excludeCredentials = makeCredentialOptions.excludeCredentials.map((c: any) => {
        c.id = coerceToArrayBuffer(c.id);
        return c;
    });

    if (makeCredentialOptions.authenticatorSelection.authenticatorAttachment === null) {
        makeCredentialOptions.authenticatorSelection.authenticatorAttachment = undefined;
    }

    let newCredential: any = await navigator.credentials.create({publicKey: makeCredentialOptions});
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);
    await api.makeCredentialPost({
        id: newCredential.id,
        rawId: coerceToBase64Url(rawId),
        type: newCredential.type,
        extensions: newCredential.getClientExtensionResults(),
        response: {
            attestationObject: coerceToBase64Url(attestationObject),
            clientDataJSON: coerceToBase64Url(clientDataJSON)
        }
    });
    window.location.href = "/login";
}

const fidoLoginNoRegister = async (input: string) => {
    let userVerification = "";

    let api = new FidoApi(OpenApiSettings, "", instance);

    try {
        let makeAssertionOptions: Fido2NetLibAssertionOptions = (await api.assertionOptionsPost(input)).data;
        if(!makeAssertionOptions?.challenge || !makeAssertionOptions?.allowCredentials) {
            throw new Error();
        }
        // webauthn chicanery
        const options: any = {};
        Object.assign(options, makeAssertionOptions);
        const challenge = makeAssertionOptions.challenge.replace(/-/g, "+").replace(/_/g, "/");
        options.challenge = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));
        options.allowCredentials.forEach((listItem: any) => {
            if(!listItem?.id) {
                return;
            }
            let fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
            listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
        });
        const credential: any = await navigator.credentials.get({publicKey: options});
        if(!credential) {
            throw new Error();
        }
        let authData = new Uint8Array(credential.response?.authenticatorData);
        let clientDataJSON = new Uint8Array(credential.response.clientDataJSON);
        let rawId = new Uint8Array(credential.rawId);
        let sig = new Uint8Array(credential.response?.signature);
        await api.makeAssertionPost({
            id: credential.id,
            rawId: coerceToBase64Url(rawId),
            type: credential.type,
            extensions: credential.getClientExtensionResults(),
            response: {
                authenticatorData: coerceToBase64Url(authData),
                clientDataJSON: coerceToBase64Url(clientDataJSON),
                signature: coerceToBase64Url(sig)
            }
        });

        const returnUrl = GetReturnUrl(window.location.search);
        await NavigateToReturnUrl(returnUrl);
    } catch (e) {
        throw new Error("Niepoprawne dane logowania lub niepotwierdzony adres e-mail");
    }

}

//  https://github.com/passwordless-lib/fido2-net-lib/blob/b6f76420ba74f2a6a0486816f2cf36094b12fe9d/Demo/wwwroot/js/helpers.js#L1
const coerceToArrayBuffer = (thing: any, name: any = "") => {
    if (typeof thing === "string") {
        // base64url to base64
        thing = thing.replace(/-/g, "+").replace(/_/g, "/");

        // base64 to Uint8Array
        var str = window.atob(thing);
        var bytes = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        thing = bytes;
    }

    // Array to Uint8Array
    if (Array.isArray(thing)) {
        thing = new Uint8Array(thing);
    }

    // Uint8Array to ArrayBuffer
    if (thing instanceof Uint8Array) {
        thing = thing.buffer;
    }

    // error if none of the above worked
    if (!(thing instanceof ArrayBuffer)) {
        throw new TypeError("could not coerce '" + name + "' to ArrayBuffer");
    }

    return thing;
};


const coerceToBase64Url = (thing: any) => {
    // Array or ArrayBuffer to Uint8Array
    if (Array.isArray(thing)) {
        thing = Uint8Array.from(thing);
    }

    if (thing instanceof ArrayBuffer) {
        thing = new Uint8Array(thing);
    }

    // Uint8Array to base64
    if (thing instanceof Uint8Array) {
        var str = "";
        var len = thing.byteLength;

        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(thing[i]);
        }
        thing = window.btoa(str);
    }

    if (typeof thing !== "string") {
        throw new Error("could not coerce to string");
    }

    // base64 to base64url
    // NOTE: "=" at the end of challenge is optional, strip it off here
    thing = thing.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");

    return thing;
};

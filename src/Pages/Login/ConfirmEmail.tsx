import {FunctionComponent, useEffect} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useLocation, useMount} from "react-use";
import qs from "qs";
import {ConfirmEmailApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../../Config";
import {instance} from "../Authed/Mutations";
import {useNavigate} from "react-router-dom";

export const ConfirmEmail: FunctionComponent = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const route = useLocation();
    const navigate = useNavigate();
    const getCaptchaResponse = async () => executeRecaptcha ? await executeRecaptcha("confirm_email") : '';
    const code = qs.parse(window.location.search.substring(1))["code"];

    useEffect(() => {
        (async () => {
            const response = await getCaptchaResponse();
            const api = new ConfirmEmailApi(OpenApiSettings, "", instance);
            await api.apiAuthConfirmEmailPost({
                code: String(code),
                captchaResponse: response
            });
            navigate("/");
        })();
    }, [code, getCaptchaResponse]);

    return (
        <></>
    )
}

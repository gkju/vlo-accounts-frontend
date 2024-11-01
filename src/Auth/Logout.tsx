import qs from "qs";
import {useMount} from "react-use";
import {LogoutApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../Config";
import {instance} from "../Pages/Authed/Mutations";
import {useEffect, useState} from "react";
import {Button} from "@gkju/vlo-ui";
import authService from "./AuthService";

export const Logout = () => {
    let id = qs.parse(window.location.search.substring(1))["logoutId"];
    // ctf challenge
    const [iFrameUrl, setIframeUrl] = useState('');

    useEffect(() => {
        logOut();
    }, [setIframeUrl]);

    const logOut = async () => {
        let api = new LogoutApi(OpenApiSettings, '', instance);
        let res = await api.apiAuthLogoutPost(id?.toString());
        setIframeUrl(res?.data.signOutIFrameUrl ?? '');

        setTimeout(() => {
            window.location.href = res?.data.postLogoutRedirectUri ?? 'https://suvlo.pl';
        }, 100);
    }

    return <>
        <Button onPointerUp={logOut}> Wyloguj się </Button>
        <iframe src={iFrameUrl}/>
    </>;
}

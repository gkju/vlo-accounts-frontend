import axios from "axios";
import {ReturnUrlInfoApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../Config";
import {instance} from "./Authed/Mutations";

export const NavigateToReturnUrl = async (returnUrl: string) => {
    try {
        let api = new ReturnUrlInfoApi(OpenApiSettings, "", instance);
        let res = await api.apiAuthReturnUrlInfoPost({returnUrl});
        if(res.data?.validReturnUrl) {
            window.location.href = returnUrl;
        } else {
            window.location.href = "/";
        }
    } catch (response) {
        window.location.href = "/";
    }

}

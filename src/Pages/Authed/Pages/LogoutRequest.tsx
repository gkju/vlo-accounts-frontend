import {FunctionComponent, useEffect} from "react";
import AuthService from "../../../Auth/AuthService";

export const LogoutRequest: FunctionComponent = () => {
    useEffect(() => {
       AuthService.signOut();
    });

    return <></>
}

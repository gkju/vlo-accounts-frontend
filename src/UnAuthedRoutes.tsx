import React, {Fragment, FunctionComponent, ReactPropTypes} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {Login} from "./Pages/Login";
import {RegisterExternalLogin} from "./Pages/RegisterExternalLogin";
import {Privacy} from "./Privacy";
import {Logout} from "@mui/icons-material";
import {LogoutCallback} from "./Auth/LogoutCallback";
import {FidoRegister} from "./Pages/Login/FidoRegister";
import {ConfirmEmail} from "./Pages/Login/ConfirmEmail";
import {LogoutRequest} from "./Auth/LogoutRequest";
import {LoginCallback} from "./Auth/LoginCallback";

type RoutesProps = {

}

export const UnAuthedRoutes: FunctionComponent<RoutesProps> = (props) => {

    return (
        <Routes>
            <Route path="/ConfirmEmail" element={<ConfirmEmail />} />
            <Route path="/FidoRegister" element={<FidoRegister />} />
            <Route path="/LogoutRequest" element={<LogoutRequest />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/logout-callback" element={<LogoutCallback />} />
            <Route path="/login-callback" element={<LoginCallback />} />
            <Route path="/Privacy" element={<Privacy />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/RegisterExternalLogin" element={<RegisterExternalLogin />} />
            <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
    )
}

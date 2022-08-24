import React, {Fragment, FunctionComponent, ReactPropTypes} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import authService from "./Auth/AuthService";
import {Dashboard} from "./Pages/Authed/Dashboard";
import {Menu} from "@gkju/vlo-ui";
import {Privacy} from "./Privacy";
import {Logout} from "@mui/icons-material";
import {LogoutCallback} from "./Auth/LogoutCallback";

export const AuthedRoutes: FunctionComponent = (props) => {

    return (
        <Fragment>
            <Routes>
                <Route path="/Logout" element={<Logout />} />
                <Route path="/logout-callback" element={<LogoutCallback />} />
                <Route path="/Privacy" element={<Privacy />} />
                <Route path="*" element={<Dashboard/>} />
            </Routes>
        </Fragment>
    )
}

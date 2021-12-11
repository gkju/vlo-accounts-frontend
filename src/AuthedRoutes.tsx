import {Fragment, FunctionComponent, ReactPropTypes} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import authService from "./Auth/AuthService";
import {Dashboard} from "./Pages/Authed/Dashboard";

export const AuthedRoutes: FunctionComponent = (props) => {

    return (
        <Routes>
            <Route path="/AccountManagement" element={<Dashboard/>} />
            <Route path="*" element={<Navigate to="/AccountManagement" />} />
        </Routes>
    )
}

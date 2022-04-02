import {Fragment, FunctionComponent, ReactPropTypes} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import authService from "./Auth/AuthService";
import {Dashboard} from "./Pages/Authed/Dashboard";
import {Menu} from "./Components/LeftMenu";

export const AuthedRoutes: FunctionComponent = (props) => {

    return (
        <Fragment>
            <Menu />
            <Routes>
                <Route path="*" element={<Dashboard/>} />
                <Route path="manage" />
            </Routes>
        </Fragment>
    )
}

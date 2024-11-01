import React, {PropsWithChildren, Fragment, FunctionComponent, useState} from "react";
import {UnAuthedRoutes} from "./UnAuthedRoutes";
import {AuthedRoutes} from "./AuthedRoutes";
import {useMount} from "react-use";
import {selectLoggedIn} from "./Redux/Slices/Auth";
import {useSelector} from "react-redux";
import authService from "./Auth/AuthService";
import {Loader} from "./Loader";

type OIDCLogonProps = {
}

export const OIDCLogon: FunctionComponent<OIDCLogonProps> = (props) => {
    let loggedIn: boolean = useSelector(selectLoggedIn);
    const [ready, setReady] = useState(false);

    useMount(async () => {
        try {
            if(!loggedIn) {
                await authService.signInSilent();
            }
        } catch (e) {

        }
        setReady(true);
    })

    return (
        <Fragment>
            {ready ?
                <Fragment>
                    {loggedIn ?
                        <AuthedRoutes /> :
                        <UnAuthedRoutes />
                    }
                </Fragment> :
                <Loader />
            }
        </Fragment>
    )
}

export default OIDCLogon;

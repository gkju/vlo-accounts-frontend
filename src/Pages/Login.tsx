import {FunctionComponent, useState} from "react";
import {Logo} from "../Logo";
import {Button, TextInput, InputSize} from "vlo-ui";
import {Form, FormikProvider, FormikValues, useFormik} from "formik";
import * as Yup from 'yup';
import {motion} from "framer-motion";
import {useMount} from "react-use";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import qs from "qs";
import {NavigateToReturnUrl} from "./ReturnUrlUtils";
import {ReactComponent as GoogleLogo } from "./glogo.svg";
import {Layout, ErrorSpan, InputWrapper, Container, Bg} from "./SharedStyledComponents";
import {LoginApi} from "vlo-accounts-client";
import {apiLocation, apiOrigin, OpenApiSettings} from "../Config";
import {GetReturnUrl} from "../Utils";
import {LoginWithPassword} from "./Login/LoginPassword";

const navigateGoogle = () => {
    window.location.href = apiOrigin + apiLocation + "/Auth/ExternalLogin?provider=Google" + (window.location.search.length > 1 ? "&" + window.location.search.substr(1) : "");
}

export const Login: FunctionComponent = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    let error: string = String(qs.parse(window.location.search.substr(1))["error"]);

    if(error === "undefined") {
        error = "";
    }

    const [loginError, setLoginError] = useState("");

    useMount(() => {
        if(error !== "") {
            setLoginError(error);
        }
    })

    return (
        <Layout>
            <Container>
                <Logo />
                <section>
                    <LoginWithPassword loginError={loginError} setLoginError={setLoginError} />
                    <InputWrapper style={{marginTop: "0"}}>
                        <Button onClick={navigateGoogle} type="submit" primaryColor="#FFFFFF" secondaryColor="#595959" size={InputSize.Medium} style={{display: "flex", justifyContent: "center", alignContent: "center"}}>Zaloguj się z <GoogleLogo style={{width: "42px", marginBottom: "-8px", marginLeft: "20px", transform: "scale(1.7)"}}/></Button>
                    </InputWrapper>
                </section>
            </Container>
            <Bg/>
        </Layout>
    )
}

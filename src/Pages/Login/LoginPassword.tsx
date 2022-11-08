import {Form, Formik, FormikProvider, FormikValues, useFormik} from "formik";
import {ErrorSpan, InputWrapper} from "../SharedStyledComponents";
import {Button, InputSize, TextInput} from "@gkju/vlo-ui";
import {motion} from "framer-motion";
import {FunctionComponent, PropsWithChildren} from "react";
import {ChangePasswordApi, LoginApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../../Config";
import {GetReturnUrl} from "../../Utils";
import {NavigateToReturnUrl} from "../ReturnUrlUtils";
import * as Yup from "yup";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {UnwrapErrors} from "../Authed/Mutations";

interface LoginWithPasswordProps {
    loginError: string,
    setLoginError: any
}

export const LoginWithPassword: FunctionComponent<LoginWithPasswordProps> = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const returnUrl = GetReturnUrl(window.location.search);

    const loginError = props.loginError;
    const setLoginError = props.setLoginError;
    // TODO refactor client error processing when receiving errors in body (new unified format)

    const handleSubmit = async (values: FormikValues) => {
        setLoginError("");
        const captchaResponse = executeRecaptcha ? await executeRecaptcha("login") : "";
        try {
            let loginApi: LoginApi = new LoginApi(OpenApiSettings);
            let response = await UnwrapErrors(async () => loginApi.apiAuthLoginPost(GetReturnUrl(window.location.search), {userNameOrEmail: values.username, password: values.password, rememberMe: true, captchaResponse}));

            if(response.status === 200) {
                await NavigateToReturnUrl(returnUrl);
            } else {
                throw response;
            }
        } catch (res: any) {
            let response = res.response;
            setLoginError(res.message);
            if(response.status === 422) {
                //handle 2fa
            }  else if(response.status === 423) {
                setLoginError("Konto zostało zablokowane na 5 minut po ostatniej nieudanej próbie logowania");
            } else {

            }
        }
    }

    const Formik = useFormik(        {
        initialValues: {username: '', password: ''},
        onSubmit: handleSubmit,
        validationSchema: Yup.object({
            username: Yup.string()
                .required("Podaj nazwę użytkownika"),
            password: Yup.string()
                .required("Podaj hasło")
                .min(8, "Hasło musi mieć co najmniej 8 znaków")
                .matches(/\W/, "Hasło musi zawierać znak specjalny")
                .matches(/\d/, "Hasło musi zawierać cyfrę")
                .matches(/(.*[a-z].*)/, "Hasło musi zawierać co najmniej jedną małą literę")
                .matches(/(.*[A-Z].*)/, "Hasło musi zawierać co najmniej jedną dużą literę")
        })
    });

    return (
        <FormikProvider value={Formik}>
            <Form autoComplete="off">
                <InputWrapper>
                    <TextInput name="username" placeholder={"Nazwa użytkownika"} size={InputSize.Medium} />
                </InputWrapper>
                <InputWrapper>
                    <TextInput name="password" password={true} placeholder={"Hasło"} size={InputSize.Medium} />
                </InputWrapper>
                <InputWrapper style={{marginBottom: "0"}}>
                    <Button type={!Formik.isSubmitting ? "submit" : "button"} size={InputSize.Medium}>Zaloguj się</Button>
                </InputWrapper>
                <InputWrapper style={{marginTop: "5px"}}>
                    <ErrorSpan style={{zIndex: 1, margin: "0 0", maxWidth: "400px"}}>
                        <motion.span animate={{opacity: loginError !== "" ? 1 : 0}}>{loginError}</motion.span>
                    </ErrorSpan>
                </InputWrapper>
            </Form>
        </FormikProvider>
    );
}

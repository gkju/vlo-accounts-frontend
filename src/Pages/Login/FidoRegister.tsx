import {FunctionComponent, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useNavigate} from "react-router-dom";
import qs from "qs";
import {useLocation, useMount} from "react-use";
import {fidoLogin, fidoRegister} from "./Fido";
import {Bg, Container, ErrorSpan, InputWrapper, Layout} from "../SharedStyledComponents";
import {Logo} from "../../Logo";
import {LoginWithPassword} from "./LoginPassword";
import {Button, InputSize, RippleAble, TextInput} from "@gkju/vlo-ui";
import {ReactComponent as GoogleLogo} from "../glogo.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {object} from "yup";
import {motion} from "framer-motion";
import {UnwrapErrors} from "../Authed/Mutations";
import { Section } from "../Login";

export const FidoRegister: FunctionComponent = () => {
    const initialValues = {
        username: "",
        email: ""
    };
    const [registerError, setRegisterError] = useState("");
    const { executeRecaptcha } = useGoogleReCaptcha();
    const route = useLocation();
    const getCaptchaResponse = async () => executeRecaptcha ? await executeRecaptcha("fido") : '';

    const handler = async (values: typeof initialValues, {setSubmitting}: any) => {
        try {
            await UnwrapErrors(async () => await fidoRegister(values.username, values.email, await getCaptchaResponse()));
        } catch (e: any) {
            setRegisterError(String(e.message));
        }
        setSubmitting(false);
    };

    return (
        <Layout>
            <Container>
                <Logo />
                <Section>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={Yup.object({
                            username: Yup.string()
                                .required("Podaj nazwę użytkownika"),
                            email: Yup.string()
                                .required("Podaj adres email")
                                .email("Podaj poprawny adres email")
                        })}
                        onSubmit={handler}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <InputWrapper style={{marginTop: "70px"}}>
                                    <TextInput name="username" placeholder={"Nazwa użytkownika"} size={InputSize.Medium} />
                                </InputWrapper>
                                <InputWrapper>
                                    <TextInput name="email" placeholder={"E-mail"} size={InputSize.Medium} />
                                </InputWrapper>
                                <InputWrapper style={{marginBottom: "0"}}>
                                    <Button type={!isSubmitting ? "submit" : "button"} size={InputSize.Medium}>Zarejestruj się</Button>
                                </InputWrapper>
                                <InputWrapper style={{marginTop: "5px"}}>
                                    <ErrorSpan style={{zIndex: 1, margin: "0 0", maxWidth: "400px"}}>
                                        <motion.span animate={{opacity: registerError !== "" ? 1 : 0}}>{registerError}</motion.span>
                                    </ErrorSpan>
                                </InputWrapper>
                            </Form>
                        )}
                    </Formik>
                </Section>
            </Container>
            <Bg/>
        </Layout>
    )
}

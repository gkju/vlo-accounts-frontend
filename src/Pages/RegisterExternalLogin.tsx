import {Logo} from "../Logo";
import {Button, Modal, TextInput, InputSize} from "@gkju/vlo-ui";
import {motion} from "framer-motion";
import {useMount} from "react-use";
import {Form, FormikProvider, FormikValues, useFormik} from "formik";
import {FunctionComponent, useState} from "react";
import {Layout, ErrorSpan, InputWrapper, Container, Bg} from "./SharedStyledComponents";
import qs from "qs";
import * as Yup from 'yup';
import { ExternalLoginApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../Config";
import {GetReturnUrl} from "../Utils";
import {useNavigate} from "react-router-dom";
import {UnwrapErrors} from "./Authed/Mutations";
import {Section} from "./Login";

export const RegisterExternalLogin: FunctionComponent = (props) => {
    const returnUrl = GetReturnUrl(window.location.search);
    const navigate = useNavigate();

    const handleSubmit = async (values: FormikValues) => {
        setRegisterError("");

        try {
            let externalLoginApi = new ExternalLoginApi(OpenApiSettings);
            let response = await UnwrapErrors(async () => await externalLoginApi.apiAuthExternalLoginCreateAccountPost( {username: values.username, email: values.email}));
            setModal(true);

        } catch (res: any) {
            setRegisterError(res.toString());
        }

    }

    const Formik = useFormik(        {
        initialValues: {username: qs.parse(window.location.search.substring(1))["username"] || "", email: qs.parse(window.location.search.substr(1))["email"] || ""},
        onSubmit: handleSubmit,
        validationSchema: Yup.object({
            username: Yup.string()
                .required("Podaj nazwę użytkownika"),
            email: Yup.string()
                .required("Podaj adres email")
                .email("Podaj poprawny adres email")
        })
    });

    const [registerError, setRegisterError] = useState("");
    const [modal, setModal] = useState(false);

    useMount(() => {

    })

    return (
        <Layout>
            <Container>
                <Logo />
                <Section>
                    <FormikProvider value={Formik}>
                        <Form>
                            <InputWrapper>
                                <TextInput name="username" placeholder={"Nazwa użytkownika"} size={InputSize.Medium} />
                            </InputWrapper>
                            <InputWrapper>
                                <TextInput name="email" placeholder={"Email"} size={InputSize.Medium} />
                            </InputWrapper>
                            <InputWrapper style={{marginBottom: "0"}}>
                                <Button type="submit" size={InputSize.Medium}>Zarejestruj się</Button>
                            </InputWrapper>
                        </Form>
                    </FormikProvider>
                    <InputWrapper style={{zIndex: 1, margin: "0 0"}}>
                        <ErrorSpan>
                            <motion.span animate={{opacity: !!registerError ? 1 : 0}}>{registerError}</motion.span>
                        </ErrorSpan>
                    </InputWrapper>
                </Section>
            </Container>
            <Bg/>
            <Modal open={modal} close={() => {setModal(false); navigate("/Login?" + qs.stringify({returnUrl: returnUrl}));}}>Potwierdź swój adres e-mail</Modal>
        </Layout>
    )
}

import {FunctionComponent, useState} from "react";
import {Logo} from "../Logo";
import {Button, TextInput, InputSize, RippleAble} from "@gkju/vlo-ui";
import {Form, FormikProvider, FormikValues, useFormik} from "formik";
import * as Yup from 'yup';
import {motion} from "framer-motion";
import {useMount} from "react-use";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import qs from "qs";
import {NavigateToReturnUrl} from "./ReturnUrlUtils";
import {ReactComponent as GoogleLogo } from "./glogo.svg";
import {Layout, ErrorSpan, InputWrapper, Container, Bg} from "./SharedStyledComponents";
import {LoginApi} from "@gkju/vlo-accounts-client-axios-ts";
import {apiLocation, apiOrigin, OpenApiSettings} from "../Config";
import {GetReturnUrl} from "../Utils";
import {LoginWithPassword} from "./Login/LoginPassword";
import styled from "styled-components";
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import {Gite} from "@mui/icons-material";
import {fidoLogin} from "./Login/Fido";
import {Link, useNavigate} from "react-router-dom";

const getExternalProviderUrl = (provider: string) => {
    return apiOrigin + apiLocation + `/Auth/ExternalLogin?provider=${provider}` + (window.location.search.length > 1 ? "&" + window.location.search.substring(1) : "");
}

const navigateGoogle = () => {
    window.location.href = getExternalProviderUrl("Google");
}

const navigateMicrosoft = () => {
    window.location.href = getExternalProviderUrl("Microsoft");
}

const navigateTwitter = () => {
    window.location.href = getExternalProviderUrl("Twitter");
}

export const Login: FunctionComponent = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const navigate = useNavigate();

    let error: string = String(qs.parse(window.location.search.substring(1))["error"]);

    if(error === "undefined") {
        error = "";
    }

    const [loginError, setLoginError] = useState("");

    useMount(() => {
        if(error !== "") {
            setLoginError(error);
        }
    })

    const fidoHandler = () => {
        fidoLogin();
    }

    return (
        <Layout>
            <Container>
                <Logo />
                <Section>
                    <LoginWithPassword loginError={loginError} setLoginError={setLoginError} />
                    <InputWrapper style={{marginTop: "-10px"}}>
                        <Button onPointerDown={navigateGoogle} type="submit" primaryColor="#FFFFFF" secondaryColor="#595959" size={InputSize.Medium} style={{display: "flex", justifyContent: "center", alignContent: "center"}}>Zaloguj się z <GoogleLogo style={{width: "42px", marginBottom: "-8px", marginLeft: "20px", transform: "scale(1.7)"}}/></Button>
                    </InputWrapper>
                    <Wrapper>
                        <GitHubIcon onPointerDown={navigateMicrosoft} style={{margin: "0 10px", cursor: "pointer", fontSize: "64px", background: "white", borderRadius: "50%", boxShadow: "inset 0 0 0 5px black"}} />
                        <RippleAble>
                            <StyledButton onPointerUp={fidoHandler}>
                                F<StyledSpan>ID</StyledSpan>O
                            </StyledButton>
                        </RippleAble>
                        <TwitterIcon onPointerDown={navigateTwitter} style={{margin: "0 10px", cursor: "pointer", fontSize: "50px", padding: "7px", background: "white", borderRadius: "50%", color: "#1DA1F2"}} />
                    </Wrapper>
                    <TextWrapper onPointerUp={() => navigate("/FidoRegister")}>
                        Zarejestruj się z FIDO (rekomendowane)
                    </TextWrapper>
                </Section>
            </Container>
            <Bg/>
        </Layout>
    )
}

export const Section = styled.section`
  margin-top: -60px;
  transform: scale(0.95);
`;

const TextWrapper = styled.div`
  color: #A1A1A1;
  opacity: 0.5;
  font-family: 'Raleway', sans-serif;
  text-align: center;
  margin: 5px;
  cursor: pointer;
`;

const StyledSpan = styled.span`
    color: #FEBF3B;
`

const StyledButton = styled.button`
  height: 100%;
  width: 100px;
  border-radius: 10px;
  color: #231F20;
  font-famliy: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 30px;
  
  border: none;
  outline: none;
  
  &:hover {
    outline: none;
    border: none;
    filter: brightness(90%);
  }

  &:active {
    outline: none;
    border: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  margin-top: -20px;
  justify-content: center;
`;

const Icon = styled.img`
  height: 64px;
  border-radius: 50%;
  background: white;
;`

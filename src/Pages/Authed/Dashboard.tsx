import {FunctionComponent, ReactPropTypes, useState, Fragment} from "react";
import styled from "styled-components";
import {theme} from "../../theme";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

export const Dashboard: FunctionComponent = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    if(executeRecaptcha)
        executeRecaptcha("login").then(console.log).catch(console.error);

    return (
      <Background>
          a
      </Background>
    );
}

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${theme.primaryShade};
`;

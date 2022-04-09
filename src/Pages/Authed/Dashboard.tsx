import {FunctionComponent, ReactPropTypes, useState, Fragment} from "react";
import styled from "styled-components";
import {theme} from "@gkju/vlo-ui";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {Route, Routes} from "react-router-dom";
import {AccountManagement} from "./Pages/AccountManagement";

export const Dashboard: FunctionComponent = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return (
      <Background>
          <Routes>

              <Route path="*" element={<AccountManagement />} />
          </Routes>
      </Background>
    );
}

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${theme.primaryShade};
`;

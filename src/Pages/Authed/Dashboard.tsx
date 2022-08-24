import React, {FunctionComponent, ReactPropTypes, useState, Fragment} from "react";
import styled from "styled-components";
import {Menu, theme} from "@gkju/vlo-ui";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {Route, Routes} from "react-router-dom";
import {AccountManagement} from "./Pages/AccountManagement";
import {Authentication} from "./Pages/Authentication";
import {ExternalLogins} from "./Pages/ExternalLogins";

export const Dashboard: FunctionComponent = (props) => {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return (
        <>
          <Menu />
          <Background>
              <Routes>
                  <Route path="Password" element={<Authentication />} />
                  <Route path="ExternalLogins" element={<ExternalLogins />} />
                  <Route path="*" element={<AccountManagement />} />
              </Routes>
          </Background>
        </>
    );
}

export const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${theme.primaryShade};
  color: white;
  font-family: 'Roboto', sans-serif;
`;

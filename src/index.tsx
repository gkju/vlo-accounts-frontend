import React from 'react';
import ReactDOM from 'react-dom';
import OIDCLogon from './OIDCLogon';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {LoginCallback} from "./Auth/LoginCallback";
import Store from "./Redux/Store/Store";
import {Provider} from "react-redux";
import {CaptchaConfig} from "./Config";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { plPL } from '@mui/material/locale';
import {createRoot} from "react-dom/client";
import {QueryClient, QueryClientProvider} from "react-query";
import {ModalHandler} from "./Redux/ReactIntegrations/ModalHandler";
import {MinimalistModalHandler} from "./Redux/ReactIntegrations/MinimalistModalHandler";
import {Privacy} from "./Privacy";
import {LogoutRequest} from "./Auth/LogoutRequest";
import {LogoutCallback} from "./Auth/LogoutCallback";
import {Logout} from "./Auth/Logout";
import {ConfirmEmail} from "./Pages/Login/ConfirmEmail";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const theme = createTheme(
    plPL
);

const container = document.getElementById('root');

const queryClient = new QueryClient();

if(container) {
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient} contextSharing={true}>
                <Provider store={Store}>
                    <GoogleReCaptchaProvider reCaptchaKey={String(CaptchaConfig.CaptchaKey)}>
                        <ThemeProvider theme={theme}>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/LogoutRequest" element={<LogoutRequest />} />
                                    <Route path="/Logout" element={<Logout />} />
                                    <Route path="/logout-callback" element={<LogoutCallback />} />
                                    <Route path="/login-callback" element={<LoginCallback />} />
                                    <Route path="/ConfirmEmail" element={<ConfirmEmail />} />
                                </Routes>
                                {window === window.parent &&
                                    <OIDCLogon/>
                                }
                            </BrowserRouter>
                            <ModalHandler />
                            <MinimalistModalHandler />
                        </ThemeProvider>
                    </GoogleReCaptchaProvider>
                </Provider>
            </QueryClientProvider>
        </React.StrictMode>
    );
}

serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

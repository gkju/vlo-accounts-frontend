import {WebStorageStateStore} from "oidc-client-ts";
import {Configuration} from "@gkju/vlo-accounts-client-axios-ts";
import authService from "./Auth/AuthService";
import {UserManagerSettings} from "oidc-client-ts";

export const CaptchaConfig = {
  CaptchaKey: "6LfvfoAaAAAAAArJt9n55Z-7WbwCJccw2QAGNOCS"
}

const otherAuthSettings = {
  WebStoragePrefix: "VLO_BOARDS_AUTH"
}

export const isDevelopment = process.env.NODE_ENV === "development";

export const frontendOrigin = isDevelopment ? "http://localhost:3000" : "https://suvlo.pl";
export const apiOrigin = isDevelopment ? "https://localhost:5001" : "https://suvlo.pl";

export const apiLocation = "/api";

export const authoritySettings: UserManagerSettings = {
  authority: apiOrigin + "/",
  client_id: "VLO_BOARDS",
  redirect_uri: frontendOrigin + "/login-callback",
  silent_redirect_uri: frontendOrigin + "/login-callback",
  response_type: "code",
  scope:"openid profile VLO_BOARDS",
  post_logout_redirect_uri : frontendOrigin + "/logout-callback",
  userStore: new WebStorageStateStore({
    prefix: otherAuthSettings.WebStoragePrefix
  }),
  includeIdTokenInSilentRenew: true,
  automaticSilentRenew: true
};

export const OpenApiSettings : Configuration = new Configuration({
  basePath: apiOrigin
});

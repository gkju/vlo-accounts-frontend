import {User, UserManager, WebStorageStateStore} from "oidc-client";
import {Configuration} from "vlo-accounts-client";
import authService from "./Auth/AuthService";

export const CaptchaConfig = {
  CaptchaKey: "6LfvfoAaAAAAAArJt9n55Z-7WbwCJccw2QAGNOCS"
}

const otherAuthSettings = {
  WebStoragePrefix: "VLO_BOARDS_AUTH"
}

export const frontendOrigin = "http://localhost:3000";
export const apiOrigin = "https://localhost:5001";

export const apiLocation = "/api";

export const authoritySettings = {
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
  basePath: apiOrigin,
  accessToken: authService.GetToken()
});

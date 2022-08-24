import { useQuery } from "react-query";
import { OpenApiSettings } from "../../Config";
import {
    ProfileInfoApi,
    ProfilePictureApi,
    AccountsDataModelsDataModelsApplicationUser,
    VLOBOARDSAreasAuthManageExternalLoginInfo, ExternalLoginApi, ExternalLoginsManagementApi
} from "@gkju/vlo-accounts-client-axios-ts";
import axios, { AxiosResponse } from "axios";
import {externalLoginInfo, profileInfo, profilePicture} from "./Constants";

const instance = axios.create({
  withCredentials: true
})

const pfpApi = new ProfilePictureApi(OpenApiSettings, undefined, instance);
const profileInfoApi = new ProfileInfoApi(OpenApiSettings, undefined, instance);
const externalLoginsManagementApi = new ExternalLoginsManagementApi(OpenApiSettings, undefined, instance);

export const useProfilePicture = (Id: string) => {
    const { data, error, isLoading } = useQuery<AxiosResponse>([profilePicture, Id], () => {
        return pfpApi.apiAuthProfilePictureGet(Id);
    });

    return { data, error, isLoading };
};

export const useProfileInfo = () => {
    return useQuery<AxiosResponse<AccountsDataModelsDataModelsApplicationUser>>([profileInfo, "own"], () => {
        return profileInfoApi.apiAuthProfileInfoGet();
    });
}

export const useLogins = () => {
    return useQuery<AxiosResponse<VLOBOARDSAreasAuthManageExternalLoginInfo>>([externalLoginInfo, "own"], () => {
        return externalLoginsManagementApi.apiAuthExternalLoginsManagementGet();
    });
}

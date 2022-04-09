import { useQuery } from "react-query";
import { OpenApiSettings } from "../../Config";
import {ProfilePictureApi} from "@gkju/vlo-accounts-client-axios-ts";
import axios from "axios";

const instance = axios.create({
  withCredentials: true
})

const pfpApi = new ProfilePictureApi(OpenApiSettings, undefined, instance);

export const useProfilePicture = (Id: string) => {
    const { data, error, isLoading } = useQuery(["profilePicture", Id], () => {
        return pfpApi.apiAuthProfilePictureGet(Id);
    });

    return { data, error, isLoading };
};

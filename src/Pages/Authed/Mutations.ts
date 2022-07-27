import {useMutation, useQuery, useQueryClient} from "react-query";
import { OpenApiSettings } from "../../Config";
import {ProfilePictureApi} from "@gkju/vlo-accounts-client-axios-ts";
import axios, {AxiosError} from "axios";

const instance = axios.create({
    withCredentials: true
})

const pfpApi = new ProfilePictureApi(OpenApiSettings, undefined, instance);

export const useSetPfp = () => {
    const queryClient = useQueryClient();
    return useMutation<any,AxiosError,File>(
        (newPfp: File) => {
            return pfpApi.apiAuthProfilePicturePost(newPfp);
        },
        {
        onSettled: () => {
            queryClient.invalidateQueries(["profilePicture"])
        }
    });
};

export const useDeletePfp = () => {
    const queryClient = useQueryClient();
    return useMutation<any,AxiosError>(
        () => {
            return pfpApi.apiAuthProfilePictureDelete();
        },
        {
            onSettled: () => {
                queryClient.invalidateQueries(["profilePicture"])
            }
        });
}

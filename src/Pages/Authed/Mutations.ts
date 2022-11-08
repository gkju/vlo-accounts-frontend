import {useMutation, useQuery, useQueryClient} from "react-query";
import { OpenApiSettings } from "../../Config";
import {ChangeUserNameApi, ProfilePictureApi} from "@gkju/vlo-accounts-client-axios-ts";
import axios, {AxiosError} from "axios";
import {profileInfo, profilePicture} from "./Constants";

export const instance = axios.create({
    withCredentials: true
});

const pfpApi = new ProfilePictureApi(OpenApiSettings, undefined, instance);
const changeUserNameApi = new ChangeUserNameApi(OpenApiSettings, undefined, instance);

export const useSetPfp = () => {
    const queryClient = useQueryClient();
    return useMutation<any,AxiosError,File>(
        (newPfp: File) => {
            return pfpApi.apiAuthProfilePicturePost(newPfp);
        },
        {
        onSettled: () => {
            queryClient.invalidateQueries([profilePicture])
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
                queryClient.invalidateQueries([profilePicture])
            }
        });
};

export async function UnwrapErrors<T> (fn: () => T): Promise<T> {
    try {
        return await fn();
    } catch (e: any) {
        // @ts-ignore
        throw new Error(Object.values(e.response.data.errors)[0]?.at(0));
    }
};

export const useChangeUserName = () => {
    const queryClient = useQueryClient();
    return async (userName: string) => {
        await UnwrapErrors(() => changeUserNameApi.apiAuthChangeUserNamePost(userName));
        //await changeUserNameApi.apiAuthChangeUserNamePost(userName);
        await queryClient.invalidateQueries([profileInfo]);
    };
};

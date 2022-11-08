import React, {Fragment, FunctionComponent} from "react";
import {EditableProfilePicture} from "../Components/EditableProfilePicture";
import {useSelector} from "react-redux";
import {selectProfile} from "../../../Redux/Slices/Auth";
import {useLogins, useProfileInfo} from "../Queries";
import {
    createMinimalistModal,
    Intro,
    Name, Section,
    SectionItem,
    SectionLegend,
    SectionValue,
    StyledEditButton,
    SubName,
    Wrapper
} from "./AccountManagement";
import { Skeleton } from "@mui/material";
import { VLoader } from "@gkju/vlo-ui";
import {useLocation, useWindowSize} from "react-use";
import argon from "../argon2-logo.svg";
import {queueMinimalistModal} from "../../../Redux/Slices/MinimalModal";
import {ChangePasswordApi, ExternalLoginsManagementApi, SetPasswordApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../../../Config";
import {instance, UnwrapErrors} from "../Mutations";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {externalLoginInfo, profileInfo} from "../Constants";
import {useQueryClient} from "react-query";

export const ExternalLogins: FunctionComponent = () => {
    const profile = useSelector(selectProfile);
    const {data, error, isLoading} = useProfileInfo();
    const logins = useLogins();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const route = useLocation();
    const getCaptchaResponse = async () => executeRecaptcha ? await executeRecaptcha("authentication") : '';
    const { width } = useWindowSize();
    const horizontal = width < 800;
    const hasPassword = (pwHash: string) => pwHash  !== '-';
    const queryClient = useQueryClient();

    if(!profile) {
        return <VLoader />;
    }

    const loginsD = logins?.data;
    const loginsData = loginsD?.data ?? {};

    const hasLogin = (loginName: string) => {
        if(!loginsData.currentLogins) {
            return false;
        }
        return loginsData.currentLogins.some(l => l.loginProvider === loginName);
    };

    const deleteProvider = async (loginProvider: string) => {
        let api = new ExternalLoginsManagementApi(OpenApiSettings, "", instance);
        if(!loginsData.currentLogins) {
            return;
        }
        const key = loginsData.currentLogins.filter(l => l.loginProvider === loginProvider)[0].providerKey ?? "";

        await UnwrapErrors(async () => await api.apiAuthExternalLoginsManagementDelete(loginProvider, key));
        await queryClient.invalidateQueries([externalLoginInfo]);
    }

    const addProvider = async (loginProvider: string) => {
        let api = new ExternalLoginsManagementApi(OpenApiSettings, "", instance);

        window.location.href = "api/Auth/ExternalLoginsManagement/GetChallenge?provider=" + loginProvider;

        await api.apiAuthExternalLoginsManagementGetChallengePost(loginProvider);


    }

    let providers = ["Google", "Microsoft", "Twitter"];

    return (
        <Wrapper style={{paddingLeft: horizontal ? "0" : "70px"}}>
            <Intro>
                <EditableProfilePicture profile={profile} />
                <Name>
                    {isLoading ? <Skeleton animation="wave" /> :
                        <Fragment>
                            {data?.data.userName}
                            <SubName>
                                {data?.data.email}
                            </SubName>
                        </Fragment>
                    }
                </Name>
            </Intro>
            <Section key={route.pathname} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                {providers.map(provider => (
                    <SectionItem key={provider}>
                        <SectionLegend>{provider}</SectionLegend>
                        <SectionValue>{logins.isLoading ? <Skeleton animation="wave" /> : hasLogin(provider) ? "Tak" : "Nie" }</SectionValue>
                        {hasLogin(provider) ? (
                            <StyledEditButton onPointerUp={() => deleteProvider(provider)} text="Usuń" />
                        ) : (
                            <StyledEditButton onPointerUp={() => addProvider(provider)} text="Dodaj" />
                        )}

                    </SectionItem>)
                )}
            </Section>
        </Wrapper>
    )
}

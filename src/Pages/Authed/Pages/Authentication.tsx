import React, {Fragment, FunctionComponent} from "react";
import {EditableProfilePicture} from "../Components/EditableProfilePicture";
import {useSelector} from "react-redux";
import {selectProfile} from "../../../Redux/Slices/Auth";
import {useProfileInfo} from "../Queries";
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
import {ChangePasswordApi, SetPasswordApi } from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../../../Config";
import {instance, UnwrapErrors} from "../Mutations";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {profileInfo} from "../Constants";
import {useQueryClient} from "react-query";

export const Authentication: FunctionComponent = () => {
    const profile = useSelector(selectProfile);
    const {data, error, isLoading} = useProfileInfo();
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

    let handlePasswordEdit = async () => {
        createMinimalistModal({
            placeholder: "Nowe hasło",
            validator: (s) => {
                if(!s.length) {
                    throw new Error("Podaj hasło");
                }
            },
            handler: async (s) => {
                let api = new SetPasswordApi(OpenApiSettings, "", instance);
                await UnwrapErrors(async () => await api.apiAuthSetPasswordPut(s));
                if(hasPassword(data?.data.passwordHash ?? "")) {
                    await handleOldPassword(s);
                } else {
                    await UnwrapErrors(async () => await api.apiAuthSetPasswordPost({newPassword: s}));
                    await UnwrapErrors(async () => await queryClient.invalidateQueries([profileInfo]));
                }
            },
            password: true
        });
    }

    let handleOldPassword = async (newPassword: string) => {
        createMinimalistModal({
            placeholder: "Stare hasło",
            validator: (s) => {
                if(!s.length) {
                    throw new Error("Podaj hasło");
                }
            },
            handler: async (s) => {
                let api = new SetPasswordApi(OpenApiSettings, "", instance);
                await UnwrapErrors(async () => await api.apiAuthSetPasswordPut(s));
                let changePwApi = new ChangePasswordApi(OpenApiSettings, "", instance);
                await UnwrapErrors(async () => await changePwApi.apiAuthChangePasswordPost({
                    captchaResponse: await getCaptchaResponse(),
                    oldPassword: s,
                    newPassword
                }));
            },
            password: true
        });
    }

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
                <SectionItem>
                    <SectionLegend>Hasło <img style={{height: "10px"}} src={argon} /></SectionLegend>
                    <SectionValue>{isLoading ? <Skeleton animation="wave" /> : !hasPassword(data?.data.passwordHash ?? "") ? "Brak" : "Tak"}</SectionValue>
                    <StyledEditButton onPointerUp={handlePasswordEdit} />
                </SectionItem>
            </Section>
        </Wrapper>
    )
}

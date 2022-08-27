import {selectProfile} from "../../../Redux/Slices/Auth";
import {useSelector} from "react-redux";
import {EditButton, theme, VLoader} from "@gkju/vlo-ui";
import React, {Fragment, FunctionComponent, useCallback} from "react";
import styled from "styled-components";
import {EditableProfilePicture} from "../Components/EditableProfilePicture";
import {useProfileInfo} from "../Queries";
import {Skeleton} from "@mui/material";
import {minimalModal, queueMinimalistModal} from "../../../Redux/Slices/MinimalModal";
import Store from "../../../Redux/Store/Store";
import {instance, UnwrapErrors, useChangeUserName} from "../Mutations";
import {Internationalization, profileInfo} from "../Constants";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {RequestEmailChangeApi} from "@gkju/vlo-accounts-client-axios-ts";
import {OpenApiSettings} from "../../../Config";
import {motion} from "framer-motion";
import {useLocation, useWindowSize} from "react-use";
import {useQueryClient} from "react-query";
export const createMinimalistModal = (p: minimalModal) => Store.dispatch(queueMinimalistModal(p));

export const AccountManagement: FunctionComponent = () => {
    const profile = useSelector(selectProfile);
    const {data, error, isLoading} = useProfileInfo();
    const setUserName = useChangeUserName();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const route = useLocation();
    const getCaptchaResponse = async () => executeRecaptcha ? await executeRecaptcha("account_management") : '';
    const { width } = useWindowSize();
    const horizontal = width < 800;
    const queryClient = useQueryClient();
    // Store.dispatch(queueMinimalistModal({validator: s => s.length > 4, placeholder: "Nazwa użytkownika", handler: console.log}));

    const editUserNameHandler: React.MouseEventHandler = useCallback((e) => {
        createMinimalistModal({
            initialValue: data?.data.userName ?? "",
            handler: async s  => await setUserName(s),
            placeholder: Internationalization.userName(),
            validator: (s: string) => {if(s.length < 4) throw new Error("Za krótka")},
        });
    }, [data, setUserName]);

    const finalizeEmailChange = useCallback(() => {
        createMinimalistModal({
            initialValue: "",
            handler: async (s) => {
                let api = new RequestEmailChangeApi(OpenApiSettings, "", instance);
                await UnwrapErrors(async () => await api.apiAuthRequestEmailChangePut({code: s, captchaResponse: await getCaptchaResponse()}));
                queryClient.invalidateQueries([profileInfo]);
            },
            placeholder: "Kod wysłany na podany adres e-mail",
            validator: s => {if(s.length < 6) throw new Error("Niepoprawny kod")},
        });
    }, [getCaptchaResponse, queryClient]);

    const changeEmailHandler = useCallback(() => {
        createMinimalistModal({
            handler: async (s) => {
                const api = new RequestEmailChangeApi(OpenApiSettings, "", instance);
                await UnwrapErrors(async () => api.apiAuthRequestEmailChangePost({
                    email: s,
                    captchaResponse: await getCaptchaResponse(),
                }));

                await finalizeEmailChange();
            },
            placeholder: "Nowy adres e-mail",
            validator: input => {
                if(!input.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    throw new Error("Podaj prawidłowy adres e-mail");
                }
            }
        });
    }, [finalizeEmailChange, getCaptchaResponse]);

    const prettyPrintNumber = (s: string): string => {
        let arr: string[] = [];
        for(let i = s.length; i >= 0; i -= 3) {
            arr.push(s.substring(Math.max(i - 3, 0), i));
        }
        return arr.reverse().join(" ");
    };

    const changePhoneNumberHandler = useCallback(() => {
        createMinimalistModal({
            handler: async (s) => {

            },
            placeholder: "Numer telefonu",
            validator: input => {
                if(!input.match("^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$")) {
                    throw new Error("Podaj prawidłowy numer telefonu");
                }
            }
        });
    },  [getCaptchaResponse]);

    if(!profile) {
        return <VLoader />;
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
                <SectionLegend>Nazwa użytkownika</SectionLegend>
                <SectionValue>{isLoading ? <Skeleton animation="wave" /> : data?.data.userName}</SectionValue>
                <StyledEditButton onPointerUp={editUserNameHandler} />
            </SectionItem>
            <SectionItem>
                <SectionLegend>Adres e-mail</SectionLegend>
                <SectionValue>{isLoading ? <Skeleton animation="wave" /> : data?.data.email}</SectionValue>
                <StyledEditButton onPointerUp={changeEmailHandler} />
            </SectionItem>
            <SectionItem>
                <SectionLegend>Numer telefonu</SectionLegend>
                <SectionValue>{isLoading ? <Skeleton animation="wave" /> : data?.data.phoneNumber ? prettyPrintNumber(data?.data.phoneNumber) : "-"}</SectionValue>
                <StyledEditButton onPointerUp={changePhoneNumberHandler} />
            </SectionItem>
        </Section>
    </Wrapper>
    );
};

export const Wrapper = styled.div`
    display: grid;
    grid-template-rows: 1fr 8fr 3fr;
    justify-content: center;
    height: 100vh;
    justify-items: center;
    align-items: center;
`;

export const Intro = styled.div`
  margin-top: 80px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const Name = styled.div`
  font-family: Roboto, sans-serif;
  font-weight: 700;
  color: white;
  font-size: 50px;
  text-align: center;
  margin: 10px;
  width: 50vw;
  max-width: 300px;
`;

export const SubName = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #707070;
`;

export const Section = styled(motion.div)`
  display: flex;
  width: 80vw;
  @media (max-width: 800px) {
    width: 90vw;
  }
  max-width: 700px;
  border-radius: 30px;
  font-family: Roboto, sans-serif;
  font-weight: 700;
  color: white;
  background: linear-gradient(145deg, #282837, #21212e);
  box-shadow:  34px 34px 68px #1c1c27,
    -34px -34px 68px #2e2e3f;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 15px 30px;
`;

export const SectionItem = styled.div`
  max-height: 80px;
  padding: 15px 20px 0;
  display: grid;
  grid-template-rows: 0.25fr 0.5fr;
  grid-template-columns: 10fr 1fr;
  max-width: 100%;
`;

export const SectionLegend = styled.div`
  font-family: "Raleway", sans-serif;
  font-weight: 700;
  color: white;
  opacity: 0.3;
  font-size: 14px;
  grid-row: 1;
  grid-column: 1;
  width: 100%;
  margin: 0 5px;
`;

export const SectionValue = styled.div`
  font-size: 40px;
  width: 100%;
  grid-row: 2;
  grid-column: 1;
  vertical-align: middle;
  display: flex;
  align-items: center;
`;


export const StyledEditButton = styled(EditButton)`
  grid-row: 2;
  grid-column: 2;
  display: flex;
  align-items: center;
  font-size: 15px;
`;

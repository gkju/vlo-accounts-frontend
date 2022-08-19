import {selectProfile} from "../../../Redux/Slices/Auth";
import {useSelector} from "react-redux";
import {EditButton, theme, VLoader} from "@gkju/vlo-ui";
import React, {Fragment, FunctionComponent} from "react";
import styled from "styled-components";
import {EditableProfilePicture} from "../Components/EditableProfilePicture";
import {useProfileInfo} from "../Queries";
import {Skeleton} from "@mui/material";
import {queueMinimalistModal} from "../../../Redux/Slices/MinimalModal";
import Store from "../../../Redux/Store/Store";

export const AccountManagement: FunctionComponent = () => {
    const profile = useSelector(selectProfile);
    const {data, error, isLoading} = useProfileInfo();
    // Store.dispatch(queueMinimalistModal({validator: s => s.length > 4, placeholder: "Nazwa użytkownika", handler: console.log}));

    if(!profile) {
        return <VLoader />;
    }

    const editUserNameHandler: React.MouseEventHandler = (e) => {
        Store.dispatch(queueMinimalistModal({
            initialValue: data?.data.userName ?? "",
            handler: (s: string) => {if(s.length < 5) throw new Error("Za krótka")},
            placeholder: "nazwa uż",
            validator: (s: string) => {if(s.length < 4) throw new Error("Za krótka")},
    }))};

    return (
    <Wrapper>
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
        <Section>
            <SectionItem>
                <SectionLegend>Nazwa użytkownika</SectionLegend>
                <SectionValue>{isLoading ? <Skeleton animation="wave" /> : data?.data.userName}</SectionValue>
                <StyledEditButton onClick={editUserNameHandler} />
            </SectionItem>
            <SectionItem>
                <SectionLegend>Nazwa użytkownika</SectionLegend>
                <SectionValue>{isLoading ? <Skeleton animation="wave" /> : data?.data.userName}</SectionValue>
                <StyledEditButton />
            </SectionItem>
            <SectionItem>
                <SectionLegend>Nazwa użytkownika</SectionLegend>
                <SectionValue>{isLoading ? <Skeleton animation="wave" /> : data?.data.userName}</SectionValue>
                <StyledEditButton />
            </SectionItem>
        </Section>
    </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-rows: 1fr 8fr 3fr;
    justify-content: center;
    height: 100vh;
    justify-items: center;
    align-items: center;
`;

const Intro = styled.div`
  margin-top: 80px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Name = styled.div`
  font-family: Roboto, sans-serif;
  font-weight: 700;
  color: white;
  font-size: 50px;
  text-align: center;
  margin: 10px;
  width: 50vw;
  max-width: 300px;
`;

const SubName = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #707070;
`;

const Section = styled.div`
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

const SectionItem = styled.div`
  max-height: 80px;
  padding: 15px 20px 0;
  display: grid;
  grid-template-rows: 0.25fr 0.5fr;
  grid-template-columns: 10fr 1fr;
  max-width: 100%;
`;

const SectionLegend = styled.div`
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

const SectionValue = styled.div`
  font-size: 40px;
  width: 100%;
  grid-row: 2;
  grid-column: 1;
  vertical-align: middle;
  display: flex;
  align-items: center;
`;


const StyledEditButton = styled(EditButton)`
  grid-row: 2;
  grid-column: 2;
  display: flex;
  align-items: center;
  font-size: 15px;
`;

import {selectProfile} from "../../../Redux/Slices/Auth";
import {useSelector} from "react-redux";
import {ProfilePicture} from "../Components/ProfilePicture";
import {VLoader} from "@gkju/vlo-ui";
import {FunctionComponent} from "react";
import styled from "styled-components";

export const AccountManagement: FunctionComponent = () => {
    const profile = useSelector(selectProfile);

    if(!profile) {
        return <VLoader />;
    }

    return (
    <Wrapper>
        <Intro>
            <ProfilePicture Id={profile.sub} />
        </Intro>

    </Wrapper>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-rows: 1fr 8fr 1fr;
    justify-content: center;
    height: 100vh;
`

const Intro = styled.div`
  margin-top: 80px;
`

import {FunctionComponent} from "react";
import {useProfilePicture} from "../Queries";
import {VLoader} from "@gkju/vlo-ui";
import {isDevelopment} from "../../../Config";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectProfile} from "../../../Redux/Slices/Auth";

interface ProfilePictureProps {
    Id: string
}

export const ProfilePicture: FunctionComponent<ProfilePictureProps> = (props) => {
    const { data, error, isLoading } = useProfilePicture(props.Id);
    const profile = useSelector(selectProfile);

    if(isLoading) {
        return <VLoader />
    }

    if(error) {
        return <div>Error</div>
    }

    if(!data?.data) {
        return <div></div>;
    }

    // TODO: find a better solution, ???
    if(isDevelopment) {
        data.data = data.data.replace("https", "http");
    }

    return (
        <img src={data.data.startsWith("http") ? data.data : `https://avatars.dicebear.com/api/identicon/${profile?.sub}.svg`} alt="Zdjęcie profilowe" style={{width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover", objectPosition:  "center"}} />
    )
}

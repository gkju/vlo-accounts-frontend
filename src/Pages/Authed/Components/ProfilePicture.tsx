import {FunctionComponent} from "react";
import {useProfilePicture} from "../Queries";
import {VLoader} from "@gkju/vlo-ui";
import {isDevelopment} from "../../../Config";
import styled from "styled-components";

interface ProfilePictureProps {
    Id: string
}

export const ProfilePicture: FunctionComponent<ProfilePictureProps> = (props) => {
    const { data, error, isLoading } = useProfilePicture(props.Id);

    if(isLoading) {
        return <VLoader />
    }

    if(error) {
        return <div>Error</div>
    }

    // TODO: find a better solution, ???
    if(isDevelopment) {
        data.data = data.data.replace("https", "http");
    }

    return (
        <img src={data.data} alt="Zdjęcie profilowe" style={{width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", objectPosition:  "center"}} />
    )
}

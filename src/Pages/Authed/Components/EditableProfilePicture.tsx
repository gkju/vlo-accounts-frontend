import {ProfilePicture} from "./ProfilePicture";
import {IdTokenClaims} from "oidc-client-ts";
import {Fragment, FunctionComponent, useRef, useState} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import MuiIcon from '@mui/icons-material/Edit';
import DeleteMuiIcon from '@mui/icons-material/Delete';
import {GetPrimary} from "../../../ThemeProvider";
import {Modal} from "@gkju/vlo-ui";
import Store from "../../../Redux/Store/Store";
import {queueModal} from "../../../Redux/Slices/Modal";

interface props {
    profile: IdTokenClaims
}

export const EditableProfilePicture: FunctionComponent<props> = (props) => {
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const callback = useRef(() => {});

    return (
        <Wrapper>
            <HideOverflow onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <motion.div animate={{scale: hover ? 1.05 : 1}} transition={{duration: 0.35}}>
                    <EditIcon animate={{opacity: hover ? 1 : 0}} transition={{duration: 0.35}}>
                        <MuiIcon style={{fontSize: "60px"}} />
                    </EditIcon>
                    <ProfilePicture Id={props.profile.sub} />
                </motion.div>
            </HideOverflow>
            <Button whileHover={{scale: 0.9}} whileTap={{scale: 0.8}} onClick={() => Store.dispatch(queueModal({title: "Uwaga!", content: "sus"}))}>
                <DeleteMuiIcon style={{fontSize: "25px"}} />
            </Button>
        </Wrapper>
    );
}

const Wrapper = styled(motion.div)`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    user-select: none;
`;

const EditIcon = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.6);
    color: white;
`;

const HideOverflow = styled(motion.div)`
    overflow: hidden;
    width: 200px;
    height: 200px;
    border-radius: 50%;
`;

const Button = styled(motion.div)`
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1;
    color: white;
    background: ${GetPrimary()};
    border-radius: 20%;
    padding: 5px;
    cursor: pointer;
`

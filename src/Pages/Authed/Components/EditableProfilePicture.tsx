import {ProfilePicture} from "./ProfilePicture";
import {IdTokenClaims} from "oidc-client-ts";
import React, {DragEventHandler, Fragment, FunctionComponent, MouseEventHandler, useRef, useState} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import MuiIcon from '@mui/icons-material/Edit';
import DeleteMuiIcon from '@mui/icons-material/Delete';
import {GetPrimary} from "../../../ThemeProvider";
import {Modal} from "@gkju/vlo-ui";
import Store from "../../../Redux/Store/Store";
import {queueModal} from "../../../Redux/Slices/Modal";
import {useCancellables} from "../../../Utils/UseCancelTimeouts";
import {useDeletePfp, useSetPfp} from "../Mutations";

interface props {
    profile: IdTokenClaims
}

export const EditableProfilePicture: FunctionComponent<props> = (props) => {
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const [editRotation, setEditRotation] = useState<number>(0.0);
    const [editColor, setEditColor] = useState("rgb(255,255,255)");
    const handleStates = useCancellables();
    const mutatePfp = useSetPfp();
    const deletePfp = useDeletePfp();

    const prevDP = (e: Event | React.DragEvent) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        let files = e.dataTransfer.files;
        for(let file of files) {
            if(file.type.startsWith("image")) {
                return upload(file);
            }
        }

        promptEditError();
    }

    const promptEditError = () => {
        const states: [Function, number][] = [
            [() => setHover(true), 0],
            [() => setEditColor("rgb(255,70,64)"), 50],
            [() => setEditRotation(50), 100],
            [() => setEditRotation(-80), 200],
            [() => setEditRotation(40), 300],
            [() => setEditRotation(0), 400],
            [() => setEditColor("rgb(255,255,255)"), 600],
            [() => setHover(false), 600],
        ];

        handleStates(states);
    };

    const upload = (file: File) => {
        try {
            mutatePfp.mutate(file);
        } catch {
            promptEditError();
        }
    };

    const handleClick : MouseEventHandler = async (e) => {
        let opts = {
            types: [
                {
                    description: 'Images',
                    accept: {
                        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                    }
                },
            ],
                excludeAcceptAllOption: true,
            multiple: false
        };
        // @ts-ignore
        if(Window?.showOpenFilePicker) {
            // @ts-ignore
            let files: FileSystemFileHandle[] = await Window.showOpenFilePicker(opts);
            for(let file of files) {
                upload(await file.getFile());
            }
        }
    };

    const handleDelete = () => {
        Store.dispatch(queueModal({
            title: "Uwaga!",
            content: "Czy aby na pewno chcesz usunąć zdjęcie profilowe?",
            handler: () => deletePfp.mutate(),
            buttonText: "Tak"
        }));
    }

    return (
        <Wrapper onDragOver={e => {prevDP(e);}} onDrop={e => {prevDP(e); handleDrop(e)}}
                 onDragEnter={(e) => {setHover(true); prevDP(e);}} onDragLeave={(e) => {setHover(false); prevDP(e);}}>
            <HideOverflow onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <motion.div title="Przeciągnij zdjęcie profilowe lub naciśnij w kompatybilnej przeglądarce" animate={{scale: hover ? 1.05 : 1}} transition={{duration: 0.35}}>
                    <EditIcon animate={{opacity: hover ? 1 : 0, rotate: editRotation, color: editColor}} transition={{duration: 0.35}} onClick={e => handleClick(e)}>
                        <MuiIcon style={{fontSize: "60px"}} />
                    </EditIcon>
                    <ProfilePicture Id={props.profile.sub} />
                </motion.div>
            </HideOverflow>
            <Button whileHover={{scale: 0.9}} whileTap={{scale: 0.8}} onClick={() => handleDelete()}>
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
    z-index: 2;
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
    pointer-events: none;
    color: white;
    z-index: 1;
    opacity: 0;
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

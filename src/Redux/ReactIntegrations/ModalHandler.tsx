import {Fragment, FunctionComponent} from "react";
import {useSelector} from "react-redux";
import {deleteCurrentModal, modal, selectCurrentModal} from "../Slices/Modal";
import {Modal, Button, RippleAble} from "@gkju/vlo-ui";
import Store from "../Store/Store";
import styled from "styled-components";
import {GetBackground} from "../../ThemeProvider";

export const ModalHandler : FunctionComponent = (props) => {
    const modalData = useSelector(selectCurrentModal);

    const closeHandler = () => {
        if(modalData?.cancelHandler) {
            modalData.cancelHandler();
        }
        Store.dispatch(deleteCurrentModal());
    };

    const successHandler = () => {
        closeHandler();
    };

    return (
        <>
            <Modal open={modalData !== undefined} close={closeHandler}>
                <ModalBody modal={modalData} closeHandler={closeHandler} successHandler={successHandler} />
            </Modal>
        </>
    );
};

interface modalBodyProps {
    modal?: modal,
    closeHandler: () => void,
    successHandler: () => void
}

const ModalBody: FunctionComponent<modalBodyProps> = (props) => {
    let modal = props.modal;

    if(!modal) {
        return (
            <ModalBase>

            </ModalBase>
        )
    }

    return (
        <ModalBase>
            <ModalHeader>
                {modal.title}
            </ModalHeader>
            <p>{modal.content}</p>
            <ButtonStyled onClick={e => console.log(e, e.currentTarget)}>
                test
            </ButtonStyled>
        </ModalBase>
    );
};

const ModalBase = styled.div`
    display: block;
    background: ${GetBackground()};
    width: min(600px, 80vw);
    height: min(400px, 60vh);
    border-radius: 20px;
`;

const ModalHeader = styled.div`
    padding: 20px 30px;
    width: 100%;
    text-align: left;
    font-size: 40px;
`;

const ButtonStyled = styled(Button)`
    
`;

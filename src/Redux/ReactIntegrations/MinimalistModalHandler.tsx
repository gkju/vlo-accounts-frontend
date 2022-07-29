import {FunctionComponent, useState} from "react";
import {useSelector} from "react-redux";
import {deleteCurrentMinimalistModal, selectCurrentMinimalistModal} from "../Slices/MinimalModal";
import {Button, InputSize, MinimalModal, Modal} from "@gkju/vlo-ui";
import Store from "../Store/Store";
import styled from "styled-components";
import {GetBackground} from "../../ThemeProvider";

export const MinimalistModalHandler : FunctionComponent = (props) => {
    const modalData = useSelector(selectCurrentMinimalistModal);

    const closeHandler = () => {
        Store.dispatch(deleteCurrentMinimalistModal());
    };

    const successHandler = (value: string) => {
        modalData.handler(value);
        closeHandler();
    };

    return (
        <MinimalModal open={modalData !== undefined} initialValue={modalData?.initialValue ?? ''} close={closeHandler} handler={successHandler} validator={modalData?.validator ?? console.warn} placeholder={modalData?.placeholder ?? ""} />
    );
};

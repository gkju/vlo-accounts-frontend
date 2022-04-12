import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../Store/Store";

export interface modal {
    title: string,
    content: string,
    handler?: () => void,
    cancelHandler?: () => void,

}

interface modalState {
    modals: modal[]
}

const initialState = {modals: [], modalPrev: undefined} as modalState;

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        queueModal: (state, action: PayloadAction<modal>) => {
            state.modals.push(action.payload);
        },
        deleteCurrentModal: (state) => {
            state.modals.shift();
        },
    },
});

export const selectCurrentModal = (state: RootState) => state.modal.modals[0];

export const {queueModal, deleteCurrentModal} = modalSlice.actions;

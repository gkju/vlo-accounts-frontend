import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {authSlice} from "../Slices/Auth";
import {modalSlice} from "../Slices/Modal";

const rootReducer = combineReducers({auth: authSlice.reducer, modal: modalSlice.reducer});

export default configureStore({reducer: rootReducer});

export type RootState = ReturnType<typeof rootReducer>

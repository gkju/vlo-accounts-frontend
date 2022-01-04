import {MouseEventHandler, ReactElement} from "react";

export interface textInputProps {
    size?: InputSize,
    password?: boolean,
    error?: boolean,
    errors?: string,
    id?: string,
    name: string,
    placeholder: string
}

export interface RippleAbleProps {
    style?: any
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: InputSize,
    primaryColor?: string,
    secondaryColor?: string
    squared?: boolean,
    radius?: number
}

export interface inputWrapperProps {
    size?: InputSize,
}

export enum InputSize {
    Big,Medium, Small
}

export interface ModalProps {
    open: Boolean,
    close: MouseEventHandler<HTMLDivElement>
}

export interface Item {
    route: string,
    icon: ReactElement
}

export interface MenuProps {
    items?: Array<Item>
}

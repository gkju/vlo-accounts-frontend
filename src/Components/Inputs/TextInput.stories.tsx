import React, {PropsWithChildren} from 'react';
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {TextInput} from "./TextInput";
import {FormikProvider, useFormik} from "formik";

export default {
    title: 'Text input',
    component: TextInput
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = ({children, ...props}) => {
    const Formik = useFormik({
        initialValues: {example: ''},
        onSubmit: console.log,});

    return (
        <FormikProvider value={Formik}>
            <TextInput {...props}>{children}</TextInput>
        </FormikProvider>
    );
}

export const Default = Template.bind({});
Default.args = {
    name: 'example',
    placeholder: 'example'
};

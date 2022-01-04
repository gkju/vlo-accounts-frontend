import React, {PropsWithChildren} from 'react';
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Menu} from "./LeftMenu";
import {BrowserRouter} from "react-router-dom";

export default {
    title: 'Navigation menu',
    component: Menu
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = ({children, ...props}) => {
    return (
        <BrowserRouter>
            <Menu {...props}>{children}</Menu>
        </BrowserRouter>
    );
}

export const Default = Template.bind({});
Default.args = {

};

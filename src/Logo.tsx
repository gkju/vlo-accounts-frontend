import {FunctionComponent, ReactPropTypes} from "react";
import styled from "styled-components";
import logo from "./logo.svg";

export const Logo: FunctionComponent = (props) => {
    return (
        <LogoSection>
            <LogoImg src={logo} alt="logo" />
        </LogoSection>
    )
}

const LogoImg = styled.img`
  width: 80%;
`;

const LogoSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
`;

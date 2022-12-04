import vlobg from "./vlobg.png";
import styled from "styled-components";
import {theme} from "@gkju/vlo-ui";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 500px 1fr;
  grid-template-rows: 1fr;
`

export const Container = styled.div`
  background: ${theme.primary};
  display: grid;
  grid-template-rows: 1fr 2fr;
  width: 100%;
  height: 100vh;
  position: relative;
`

export const Bg = styled.div`
  height: 100%;
  background-image: Url("${vlobg}");
  background-position-y: top;
  background-position-x: center;
  background-size: cover;
`

export const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 35px 0;
  touch-action: manipulation;
`

export const ErrorSpan = styled.div`
  font-family: Raleway, serif;
  position: absolute;
  width: 100%;
  font-style: normal;
  font-weight: bold;
  color: #f44336;
  text-align: center;
  margin-top: 15px;
`

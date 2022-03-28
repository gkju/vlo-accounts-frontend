import React, {
    FunctionComponent,
    PropsWithChildren,
    Fragment,
    RefObject,
    useRef,
    useEffect,
    useState,
    MutableRefObject, ReactComponentElement, ReactElement
} from "react";
import styled from "styled-components";
import {theme} from "../theme";
import HomeIcon from "@mui/icons-material/Home";
import KeyIcon from "@mui/icons-material/Key";
import SecurityIcon from "@mui/icons-material/Security";
import GoogleIcon from "@mui/icons-material/Google";
import {motion} from "framer-motion";
import {useLocation, useNavigate} from "react-router-dom";
import {useWindowSize} from "react-use";
import {Item, MenuProps} from "./Constants";

let Items: Array<Item> = [
    {
        route: "/AccountManagement",
        icon: <HomeIcon sx={{fontSize: "inherit"}} />
    },
    {
        route: "/Password",
        icon: <KeyIcon sx={{fontSize: "inherit"}} />
    },
    {
        route: "/2FA",
        icon: <SecurityIcon sx={{fontSize: "inherit"}} />
    },
    {
        route: "/ExternalLogins",
        icon: <GoogleIcon sx={{fontSize: "inherit"}} />
    }
];

const ClosestMatch = (Items: Array<Item>, template: string) => {
    let index = 0;
    let length = 0;
    for(let i = 0; i < Items.length; ++i) {
        let itemIndex = 0;
        while(itemIndex < Items[i].route.length && Items[i].route[itemIndex] === template[itemIndex]) {
            ++itemIndex;
        }

        if(itemIndex > length) {
            length = itemIndex;
            index = i;
        }
    }

    return index;
}

export const Menu: FunctionComponent<MenuProps> = (props) => {
    const {width, height} = useWindowSize();
    const refs = useRef<HTMLDivElement[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [offset, setOffset] = useState(0);
    const [highlighterIndex, setIndex] = useState(0);

    Items = props.items ?? Items;
    const horizontal = width < 800;

    useEffect(() => {
        setOffset(horizontal ? refs.current[highlighterIndex].offsetLeft : refs.current[highlighterIndex].offsetTop);
    }, [horizontal, width, height])

    useEffect(() => {
        let index = ClosestMatch(Items, location.pathname);
        setOffset(horizontal ? refs.current[index].offsetLeft : refs.current[index].offsetTop);
        setIndex(index);
    }, [location.pathname]);

    // if items length is non const
    //useEffect(() => {
    //    refs.current = refs.current.slice(0, Items.length);
    //}, [Items.length]);

    return (
      <MenuBase $mobile={horizontal}>
          <MenuHighlighter $mobile={horizontal} as={motion.div} animate={horizontal ? {x: offset} : {y: offset}} />
          {
              Items.map((item, index) =>
                <MenuItem $mobile={horizontal} onClick={() => navigate(item.route)} animate={{opacity: highlighterIndex === index ? 1 : 0.3}} as={motion.div} whileHover={{scale: 1.05}} whileTap={{scale: 0.9}} key={index} ref={(el: (HTMLDivElement | null)) => el ? refs.current[index] = el : <Fragment />}>
                    {item.icon}
                </MenuItem>
              )
          }
      </MenuBase>
    );
}

interface MobileProps {
    $mobile: boolean
}


const MenuBase = styled.div<MobileProps>`
  background: ${theme.primary};
  width: ${props => props.$mobile ? "100%" : "70px"};
  height: ${props => !props.$mobile ? "100%" : "70px"};
  z-index: 1;
  position: fixed;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${props => props.$mobile ? "row" : "column"};
  justify-content: ${props => props.$mobile ? "space-around" : "flex-start"};
  bottom: ${props => props.$mobile ? "0" : ""};
  align-items: center;
  overflow: hidden;
`

const MenuHighlighter = styled.div<MobileProps>`
  position: absolute;
  background: ${theme.complementary};
  width: 50px;
  height: 50px;
  border-radius: 10px;
  z-index: 0;
  top: ${props => props.$mobile ? "" : "0"};
  left: ${props => !props.$mobile ? "" : "0"};
  cursor: pointer;
`

const MenuItem = styled.div<MobileProps>`
  background: transparent;
  width: ${props => props.$mobile ? "50px" : "100%"};
  height: ${props => !props.$mobile ? "50px" : "100%"};
  margin-top: ${props => props.$mobile ? "0" : "10px"};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 35px;
  cursor: pointer;
  z-index: 1;
  opacity: 0.3;
  -webkit-tap-highlight-color: transparent;
`

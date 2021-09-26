import React from 'react';
import {useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAppDispatch} from "../../hooks";
import {toggleShowingLiveChat} from "../../reducers/configs";
import {styled} from "@mui/material/styles";

interface UtilProps {
    isLive: boolean
}

const ToggleChatButton = styled(Button)`
  color: white;
`

const Util = ({isLive}: UtilProps) => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const handleToggleLiveChat = () => {
        dispatch(toggleShowingLiveChat())
    }
    if (location.pathname.includes("player") && isLive){
        return <div className={"ml-auto"}>
            <ToggleChatButton onClick={handleToggleLiveChat} color={"primary"} variant={"outlined"}>Toggle Live Chat</ToggleChatButton>
        </div>
    }
    return <></>
}

export default Util

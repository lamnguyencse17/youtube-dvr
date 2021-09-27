import React from 'react';
import {useLocation, useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {toggleShowingLiveChat} from "../../reducers/configs";
import {styled} from "@mui/material/styles";
import {YoutubeInfo} from "../../core/ytdl";

interface UtilProps {
    isLive: boolean
}

interface YoutubeIdParams {
    youtubeId: string;
}

const ToggleChatButton = styled(Button)`
  color: white;
`

const StartRecordingButton = styled(Button)`
  color: black;
  background-color: gray;
`

const StopRecordingButton = styled(Button)`
  color: red;
  background-color: white;
`

const Util = ({isLive}: UtilProps) => {
    const { youtubeId } = useParams<YoutubeIdParams>();
    const dispatch = useAppDispatch()
    const location = useLocation()
    const isAtPlayer = location.pathname.includes("player")
    const activeTab = useAppSelector(state => state.tabs.activeTab)
    let currentTab: YoutubeInfo
    if (activeTab !== "home"){
        const youtubeId = location.pathname.split("/")[2]
        currentTab = useAppSelector(state => state.tabs.tabs).find(tab => tab.youtubeId === youtubeId)
    }
    const renderRecordingButton = () => {
        console.log(currentTab)
        if (!isAtPlayer || !currentTab){
            return <></>
        }
        if (currentTab.isRecording){
            return <StopRecordingButton>Start Recording</StopRecordingButton>
        }
        return <StartRecordingButton>Start Recording</StartRecordingButton>
    }

    const handleToggleLiveChat = () => {
        dispatch(toggleShowingLiveChat())
    }
    if (isAtPlayer && isLive){
        return <div className={"ml-auto flex flex-row"}>
            <ToggleChatButton onClick={handleToggleLiveChat} color={"primary"} variant={"outlined"}>Toggle Live Chat</ToggleChatButton>
            {renderRecordingButton()}
        </div>
    }
    return <></>
}

export default Util

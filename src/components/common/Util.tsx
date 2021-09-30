import React from 'react';
import {useLocation, useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {toggleShowingLiveChat} from "../../reducers/configs";
import {styled} from "@mui/material/styles";
import {YoutubeInfo} from "../../core/ytdl";
import {stopRecording} from "../../reducers/tabs";

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
    const dispatch = useAppDispatch()
    const location = useLocation()
    const isAtPlayer = location.pathname.includes("player")
    const tabState = useAppSelector(state => state.tabs)
    let currentTab: YoutubeInfo
    if (tabState.activeTab !== "home"){
        const youtubeId = location.pathname.split("/")[2]
        currentTab = tabState.tabs.find(tab => tab.youtubeId === youtubeId)
    }
    const handleStopRecording = () => {
        const youtubeId = location.pathname.split("/")[2]
        dispatch(stopRecording(youtubeId))
    }
    const renderRecordingButton = () => {
        if (!isAtPlayer || !currentTab){
            return <></>
        }

        if (currentTab.isRecording){
            return <StopRecordingButton onClick={handleStopRecording}>Stop Recording</StopRecordingButton>
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

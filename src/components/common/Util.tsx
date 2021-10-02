import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {toggleShowingLiveChat} from "../../reducers/configs";
import {styled} from "@mui/material/styles";
import {YoutubeInfo} from "../../core/ytdl";
import {startRecording, stopRecording} from "../../reducers/tabs";
import {SAVE_FILE_PATH} from "../../events";
import RecordModal from "./RecordModal";
import {getYoutubeInfo} from "../Home";

const {ipcRenderer} = window.require('electron');

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
    const [isRecordModalOpen, setRecordModalOpen] = useState(false)
    const handleCloseRecordModal = () => {
        setRecordModalOpen(false)
    }
    const handleOpenRecordModal = () => {
        setRecordModalOpen(true)
    }
    let currentTab: YoutubeInfo
    if (tabState.activeTab !== "home") {
        const youtubeId = location.pathname.split("/")[2]
        currentTab = tabState.tabs.find(tab => tab.youtubeId === youtubeId)
    }
    const handleStopRecording = () => {
        const youtubeId = location.pathname.split("/")[2]
        dispatch(stopRecording(youtubeId))
    }
    // const handleStartRecording = async () => {
    //     const youtubeId = location.pathname.split("/")[2]
    //     const defaultFileName = tabState.activeTab + ".mp4"
    //     ipcRenderer.send(SAVE_FILE_PATH, defaultFileName)
    //     ipcRenderer.once(SAVE_FILE_PATH, (event, filePath) => {
    //         dispatch(startRecording({youtubeId, filePath}))
    //     })
    // }
    const renderRecordingButton = () => {
        if (!isAtPlayer || !currentTab) {
            return <></>
        }

        if (currentTab.isRecording) {
            return <StopRecordingButton onClick={handleStopRecording}>Stop Recording</StopRecordingButton>
        }
        return <StartRecordingButton onClick={handleOpenRecordModal}>Start Recording</StartRecordingButton>
    }

    const handleToggleLiveChat = () => {
        dispatch(toggleShowingLiveChat())
    }
    if (isAtPlayer && isLive) {
        return <div className={"ml-auto flex flex-row"}>
            <ToggleChatButton onClick={handleToggleLiveChat} color={"primary"} variant={"outlined"}>Toggle Live
                Chat</ToggleChatButton>
            {renderRecordingButton()}
            <RecordModal isRecordModalOpen={isRecordModalOpen} handleCloseRecordModal={handleCloseRecordModal} youtubeURL={`https://www.youtube.com/watch?v=${currentTab.youtubeId}`} getYoutubeInfo={getYoutubeInfo}/>
        </div>
    }
    return <></>
}

export default Util

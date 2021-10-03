import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {toggleShowingDownloadInfo, toggleShowingLiveChat} from "../../reducers/configs";
import {styled} from "@mui/material/styles";
import {YoutubeInfo} from "../../core/ytdl";
import {stopRecording} from "../../reducers/tabs";
import RecordModal from "./RecordModal";
import {getYoutubeInfo} from "../Home";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface UtilProps {
    isLive: boolean
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
    const {tabs: tabState, configs: {isShowingDownloadInfo}} = useAppSelector(state => state)
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
    const handleToggleDownloadInfo = () => {
        dispatch(toggleShowingDownloadInfo())
    }
    if (isAtPlayer) {
        return <div className={"ml-auto flex flex-row space-x-3"}>
            {isLive && <ToggleChatButton onClick={handleToggleLiveChat} color={"primary"} variant={"outlined"}>Toggle Live
                Chat</ToggleChatButton>}
            {renderRecordingButton()}
            {currentTab && currentTab.isRecording && <FormControlLabel control={<Switch color={"secondary"} checked={isShowingDownloadInfo}
                                                onChange={handleToggleDownloadInfo}/>} label="Download Info"/>}
            <RecordModal isRecordModalOpen={isRecordModalOpen} handleCloseRecordModal={handleCloseRecordModal}
                         youtubeURL={`https://www.youtube.com/watch?v=${currentTab.youtubeId}`}
                         getYoutubeInfo={getYoutubeInfo} isAtHome={false}/>
        </div>
    }
    return <></>
}

export default Util

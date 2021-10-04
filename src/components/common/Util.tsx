import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {toggleShowingLiveChat} from "../../reducers/configs";
import {styled} from "@mui/material/styles";
import {YoutubeInfo} from "../../core/ytdl";
import RecordModal from "./RecordModal";
import {getYoutubeInfo} from "../Home";
import RecordingButton from "./util/RecordingButton";
import DownloadInfoToggler from "./util/DownloadInfoToggler";

interface UtilProps {
    isLive: boolean
}

const ToggleChatButton = styled(Button)`
  color: white;
`

const Util = ({isLive}: UtilProps) => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const isAtPlayer = location.pathname.includes("player")
    const {tabs: tabState} = useAppSelector(state => state)
    const [isRecordModalOpen, setRecordModalOpen] = useState(false)
    let currentTab: YoutubeInfo
    let youtubeId: string
    if (tabState.activeTab !== "home") {
        youtubeId = location.pathname.split("/")[2]
        currentTab = tabState.tabs.find(tab => tab.youtubeId === youtubeId)
    }
    const handleToggleLiveChat = () => {
        dispatch(toggleShowingLiveChat())
    }
    const handleCloseRecordModal = () => {
        setRecordModalOpen(false)
    }
    const handleOpenRecordModal = () => {
        setRecordModalOpen(true)
    }
    if (isAtPlayer) {
        return <div className={"ml-auto flex flex-row space-x-3"}>
            {isLive && <ToggleChatButton onClick={handleToggleLiveChat} color={"primary"} variant={"outlined"}>Toggle Live
                Chat</ToggleChatButton>}
            <RecordingButton isAtPlayer={isAtPlayer} currentTab={currentTab} youtubeId={youtubeId} handleOpenRecordModal={handleOpenRecordModal}/>
            <DownloadInfoToggler currentTab={currentTab}/>
            <RecordModal isRecordModalOpen={isRecordModalOpen} handleCloseRecordModal={handleCloseRecordModal}
                         youtubeURL={`https://www.youtube.com/watch?v=${currentTab.youtubeId}`}
                         getYoutubeInfo={getYoutubeInfo} isAtHome={false}/>
        </div>
    }
    return <></>
}

export default Util

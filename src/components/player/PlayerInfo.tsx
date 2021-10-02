import React from "react"
import Chip from '@mui/material/Chip';
import {styled} from "@mui/material/styles";
import {YoutubeInfo} from "../../core/ytdl";

const LiveChip = styled(Chip)`
  background-color: red;
  color: white;
`

const ArchiveChip = styled(Chip)`
  background-color: gray;
  color: white;
`

const VideoChip = styled(Chip)`
  background-color: black;
  color: white;
`

const RecordingChip = styled(Chip)`
  background-color: #e2467a;
  color: white;
`

const renderChip = (isLiveNow: boolean, isLiveContent: boolean) => {
    if (isLiveContent && isLiveNow) {
        return <LiveChip label={"Live"}/>
    }
    if (isLiveContent && !isLiveNow) {
        return <ArchiveChip label={"Archive"}/>
    }
    return <VideoChip label={"Video"}/>
}

interface PlayerInfoProps {
    currentTab: YoutubeInfo
}

const PlayerInfo = ({currentTab}: PlayerInfoProps) => {
    if (currentTab) {
        const {isLiveNow, isLiveContent, title} = currentTab
        return <div className={"flex flex-col"}>
            <h1>{title}</h1>
            <div className={"flex flex-row"}>
                {renderChip(isLiveNow, isLiveContent)}
                {currentTab.isRecording && <RecordingChip label={"Recoding"}/>}
            </div>
        </div>
    }
    return <></>


}

export default PlayerInfo

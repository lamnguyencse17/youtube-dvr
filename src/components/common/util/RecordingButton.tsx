import React, {ReactElement} from 'react';
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import {YoutubeInfo} from "../../../core/ytdl";
import {stopRecording} from "../../../reducers/tabs";
import {useAppDispatch} from "../../../hooks";

interface RecordingButtonProps {
    isAtPlayer: boolean;
    currentTab: YoutubeInfo;
    youtubeId: string;
    handleOpenRecordModal: () => void
}

const StartRecordingButton = styled(Button)`
  color: black;
  background-color: gray;
`

const StopRecordingButton = styled(Button)`
  color: red;
  background-color: white;
`

const RecordingButton = ({isAtPlayer, currentTab, youtubeId, handleOpenRecordModal}: RecordingButtonProps): ReactElement => {
    const dispatch = useAppDispatch()
    const handleStopRecording = () => {
        dispatch(stopRecording(youtubeId))
    }

    if (!isAtPlayer || !currentTab || !youtubeId) {
        return <></>
    }
    if (currentTab.isRecording) {
        return <StopRecordingButton onClick={handleStopRecording}>Stop Recording</StopRecordingButton>
    }
    return <StartRecordingButton onClick={handleOpenRecordModal}>Start Recording</StartRecordingButton>
}

export default RecordingButton;

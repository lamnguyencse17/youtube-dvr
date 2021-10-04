import React, {ReactElement} from 'react';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {toggleShowingDownloadInfo} from "../../../reducers/configs";
import {YoutubeInfo} from "../../../core/ytdl";

interface DownloadInfoTogglerProps {
    currentTab: YoutubeInfo
}

const DownloadInfoToggler = ({currentTab}: DownloadInfoTogglerProps): ReactElement => {
    const dispatch = useAppDispatch()
    const isShowingDownloadInfo = useAppSelector(state => state.configs.isShowingDownloadInfo)
    const handleToggleDownloadInfo = () => {
        dispatch(toggleShowingDownloadInfo())
    }
    if (!currentTab && !currentTab.isRecording){
        return <></>
    }
    return (
        <FormControlLabel control={<Switch color={"secondary"} checked={isShowingDownloadInfo}
                                           onChange={handleToggleDownloadInfo}/>} label="Download Info"/>
    );
}

export default DownloadInfoToggler;

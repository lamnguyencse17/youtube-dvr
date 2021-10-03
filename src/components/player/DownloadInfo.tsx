import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../hooks";
import {SEND_DOWNLOAD_INFO} from "../../events";
import {IpcRendererEvent} from "electron";
import {YoutubeInfo} from "../../core/ytdl";
const {ipcRenderer} = window.require('electron');

interface DownloadInfoProps {
    currentTab: YoutubeInfo
}

const DownloadInfo = ({currentTab}: DownloadInfoProps) => {
    const {isShowingDownloadInfo} = useAppSelector(state => state.configs)
    const [downloadInfo, setDownloadInfo] = useState<{[key: string]: string}>()
    const handleDownloadInfo = (event: IpcRendererEvent, receivedDownloadInfo: {[key: string]: string}) => {
        setDownloadInfo(receivedDownloadInfo)
    }
    useEffect(() => {
        if (isShowingDownloadInfo){
            ipcRenderer.on(SEND_DOWNLOAD_INFO, handleDownloadInfo)
        }
        return () => {
            ipcRenderer.removeListener(SEND_DOWNLOAD_INFO, handleDownloadInfo)
        }
    }, [isShowingDownloadInfo])
    if (!isShowingDownloadInfo || !currentTab.isRecording){
        return (
            <></>
        );
    }
    return (<div className={"mx-auto flex flex-row space-x-5"}>
        {downloadInfo && Object.keys(downloadInfo).map((key) => {
            return <div>{key}: {downloadInfo[key]}</div>
        })}
    </div>)
}

export default DownloadInfo;

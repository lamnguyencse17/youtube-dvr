import {GET_YOUTUBE_INFO, RECEIVE_ERROR, SET_YOUTUBE_URL} from "../events";
import {app, IpcMainEvent, ipcMain} from "electron";
import cp from "child_process"
import path from "path";
import ytdl from "ytdl-core"
import {getProcessManager} from "./processManager";

const binRootPath = app.getAppPath();

export const initYTDL = () => {
    ipcMain.on(SET_YOUTUBE_URL, handleSetYoutubeURL)
}

export type YoutubeInfo = {
    title: string;
    youtubeId: string;
    channelName: string;
    channelId: string;
    description: string;
    isLiveNow: boolean;
    isLiveContent: boolean;
    startTimestamp: string;
}

const handleSetYoutubeURL = async (event: IpcMainEvent, youtubeURL: string) => {
    let youtubeInfo;
    try {
        youtubeInfo = await getYoutubeInfo(youtubeURL)
    } catch(err) {
        event.reply(RECEIVE_ERROR, err)
        return;
    }
    event.reply(GET_YOUTUBE_INFO, youtubeInfo)
    const {youtubeId} = youtubeInfo
    const processManager = getProcessManager()
    const ytdlPath = getBinaryPath()
    const ytdlProcess = cp.execFile(ytdlPath, ["-f", "301", youtubeURL, "--continue", "--no-part", "--hls-use-mpegts"])
    processManager.addToDict(youtubeId, ytdlProcess)
    ytdlProcess.stderr.on('error', function(data) {
        event.reply(RECEIVE_ERROR, data)
    });
    ytdlProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
}

const getBinaryPath = () => path.join(binRootPath, "bin", "youtube-dl.exe")

const getYoutubeInfo = async (youtubeURL: string): Promise<YoutubeInfo> => {
    const youtubeInfo = await ytdl.getBasicInfo(youtubeURL)
    const {videoId: youtubeId, ownerChannelName: channelName, channelId, description, isLiveContent, title} = youtubeInfo.videoDetails
    const {isLiveNow, startTimestamp} = youtubeInfo.videoDetails.liveBroadcastDetails
    return {
        title,
        youtubeId,
        channelName,
        channelId,
        description,
        isLiveContent,
        isLiveNow,
        startTimestamp
    }
}

import {
    COMING_LOG,
    GET_YOUTUBE_INFO,
    RECEIVE_ERROR,
    RECORDING_STARTED,
    SET_YOUTUBE_URL,
    START_RECORDING
} from "../events";
import {app, ipcMain, IpcMainEvent} from "electron";
import cp from "child_process"
import path from "path";
import ytdl from "ytdl-core"
import {getProcessManager} from "./processManager";

const binRootPath = app.getAppPath();
let window: Electron.BrowserWindow

export const initYTDL = (mainWindow: Electron.BrowserWindow) => {
    ipcMain.on(SET_YOUTUBE_URL, handleSetYoutubeURL)
    ipcMain.on(START_RECORDING, handleRecording)
    window = mainWindow
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
    isRecording: boolean;
}

export type StartRecordingPayload = {
    youtubeId: string;
    filePath: string;
    quality: string;
}

const handleSetYoutubeURL = async (event: IpcMainEvent, youtubeURL: string) => {
    let youtubeInfo: YoutubeInfo
    try {
        youtubeInfo = await getYoutubeInfo(youtubeURL)
    } catch (err) {
        event.reply(RECEIVE_ERROR, err)
        return;
    }
    event.reply(GET_YOUTUBE_INFO, youtubeInfo)
}

const getBinaryPath = () => path.join(binRootPath, "bin", "youtube-dl.exe")

const recordYoutubeVideo = (event: IpcMainEvent, youtubeId: string, quality: string, filePath: string) => {
    const youtubeURL = `https://www.youtube.com/watch?v=${youtubeId}`
    const processManager = getProcessManager()
    const ytdlPath = getBinaryPath()
    console.log(`"best[height=${quality}]/bestvideo+bestaudio/best"`)
    const ytdlProcess = cp.execFile(ytdlPath, [youtubeURL, "-f", `best[height=${quality}]/bestvideo+bestaudio/best`, "--merge-output-format", "mp4", "--continue", "--hls-use-mpegts", "--no-part", "-o", filePath])
    processManager.addToDict(youtubeId, ytdlProcess)
    ytdlProcess.stderr.on('data', function (data: string) {
        if (data.includes("ERROR")) {
            event.reply(RECEIVE_ERROR, data)
            return
        }
        event.reply(COMING_LOG, data)
    });
    ytdlProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    window.webContents.send(RECORDING_STARTED, youtubeId)
}

const handleRecording = (event: IpcMainEvent, {youtubeId, quality, filePath}: StartRecordingPayload) => {
    recordYoutubeVideo(event, youtubeId, quality, filePath)
}

const getYoutubeInfo = async (youtubeURL: string): Promise<YoutubeInfo> => {
    const youtubeInfo = await ytdl.getBasicInfo(youtubeURL)
    const {
        videoId: youtubeId,
        ownerChannelName: channelName,
        channelId,
        description,
        isLiveContent,
        title
    } = youtubeInfo.videoDetails
    const {isLiveNow, startTimestamp} = youtubeInfo.videoDetails.liveBroadcastDetails
    return {
        title,
        youtubeId,
        channelName,
        channelId,
        description,
        isLiveContent,
        isLiveNow,
        startTimestamp,
        isRecording: false
    }
}

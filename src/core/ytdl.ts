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

const getYoutubeInfo = async (youtubeURL: string) => {
    const youtubeInfo = await ytdl.getBasicInfo(youtubeURL)
    const youtubeId = ytdl.getVideoID(youtubeURL)
    return {title: youtubeInfo.videoDetails.title, youtubeId}
}

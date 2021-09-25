import {GET_YOUTUBE_ID, RECEIVE_ERROR, SET_YOUTUBE_URL} from "../events";
import {app, IpcMainEvent, ipcMain} from "electron";
import cp from "child_process"
import path from "path";
import ytdl from "ytdl-core"
import {getProcessManager} from "./processManager";

const binRootPath = app.getAppPath();

export const initYTDL = () => {
    ipcMain.on(SET_YOUTUBE_URL, handleSetYoutubeURL)
}

const handleSetYoutubeURL = (event: IpcMainEvent, youtubeURL: string) => {
    let youtubeID;
    try {
        youtubeID = ytdl.getVideoID(youtubeURL)
    } catch(err) {
        event.reply(RECEIVE_ERROR, err)
        return;
    }
    const processManager = getProcessManager()
    event.reply(GET_YOUTUBE_ID, youtubeID)
    const ytdlPath = getBinaryPath()
    console.log(ytdlPath)
    const ytdlProcess = cp.execFile(ytdlPath, ["-f", "301", youtubeURL, "--hls-prefer-native", "--continue", "--no-part"])
    processManager.addToDict(youtubeID, ytdlProcess)
    ytdlProcess.stderr.on('error', function(data) {
        event.reply(RECEIVE_ERROR, data)
    });
    ytdlProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
}

const getBinaryPath = () => path.join(binRootPath, "bin", "youtube-dl.exe")

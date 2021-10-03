import {ipcMain} from "electron"
import {SEND_DOWNLOAD_INFO, SET_ACTIVE_INFO} from "../events";

// frame= 1110 fps= 31 q=-1.0 size=    3072kB time=00:00:36.98 bitrate= 680.4kbits/s speed=1.03x

let activeInfo = ""
let electronWindow: Electron.BrowserWindow

export const setActiveInfo = (activeYoutubeId: string): void => {
    activeInfo = activeYoutubeId
}

export const initInfo = (mainWindow: Electron.BrowserWindow): void => {
    electronWindow = mainWindow
    ipcMain.on(SET_ACTIVE_INFO, (event, activeYoutubeId: string) => {
        setActiveInfo(activeYoutubeId)
    })
}

export const handleDownloadInfo = (log: string, youtubeId: string): void => {
    if (youtubeId !== activeInfo){
        return;
    }
    if (!log.includes("frame")) {
        return;
    }
    const downloadLog = log.replace(/ +(?= )/g, '').split(" ")
    let valueHolder = ""
    const logKeyValue: {[key: string]: string} = {}
    downloadLog.forEach(value => {
        if (value === '\r') {
            return
        }
        const equalPos = value.indexOf("=")
        if (equalPos !== value.length - 1 && equalPos !== -1) {
            const splitValues = value.split("=")
            logKeyValue[splitValues[0]] = splitValues[1]
            return
        }
        valueHolder = valueHolder + value
        if (equalPos === -1) {
            const splitValues = valueHolder.split("=")
            logKeyValue[splitValues[0]] = splitValues[1]
            valueHolder = ""
            return;
        }
    })
    electronWindow.webContents.send(SEND_DOWNLOAD_INFO, logKeyValue)
}

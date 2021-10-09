import {dialog, ipcMain} from "electron"
import {SAVE_FILE_PATH} from "../events";
import { parseFormat } from "./ytdl";

const cleanPath = (path: string) => path.toLowerCase().replace(/^(con|prn|aux|nul|((com|lpt)[0-9]))$|([<>:"/\\|?*])|(\.|\s)$/ig, " ");

export const initFileManager = (mainWindow: Electron.BrowserWindow) => {
    ipcMain.on(SAVE_FILE_PATH, async (event, defaultFilePath: string) => {
        const extension = parseFormat()
        const escapedFileName = cleanPath(defaultFilePath) + "." + extension
        const {canceled, filePath} = await dialog.showSaveDialog(mainWindow, {
            defaultPath: "./" + escapedFileName
        })
        if (canceled) {
            return
        }
        event.reply(SAVE_FILE_PATH, filePath)
    })
}

import {ipcMain, dialog} from "electron"
import {SAVE_FILE_PATH} from "../events";

const cleanPath = (path: string) => path.toLowerCase().replace(/[^a-zA-Z0-9#.?!@ ]+/g, " ");

export const initFileManager = (mainWindow: Electron.BrowserWindow) => {
    ipcMain.on(SAVE_FILE_PATH, async (event, defaultFilePath: string) => {
        const escapedFileName = cleanPath(defaultFilePath)
        const {canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
            defaultPath: "./" + escapedFileName
        })
        if (canceled){
            return
        }
        event.reply(SAVE_FILE_PATH, filePath)
    })
}

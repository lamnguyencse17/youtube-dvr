import {ipcMain, IpcMainEvent} from "electron";
import {LOAD_STATE, UNLOAD_WEB} from "../events";
import {RootState, store} from "../store";
import fs from "fs";

let isWriting = false

export const runStateManager = () => {
    ipcMain.on(UNLOAD_WEB, (event, state: RootState) => {
        writeState(state)
    })
    ipcMain.on(LOAD_STATE, (event) => {
        setTimeout(() => {loadState(event)}, 5000)
    })
}

const writeState = (state: RootState) => {
    isWriting = true
    const stateFileExists = fs.existsSync("state.json")
    if (stateFileExists){
        fs.rm("state.json", (err) => {
            if (err){
                console.log("REMOVE: ", err)
            }
            fs.writeFile("state.json", JSON.stringify(state), (err) => {
                if (err){
                    console.log("WRITE ERROR: ", err)
                }
                isWriting = false
            })
        })
    }
}

const loadState = (event: IpcMainEvent) => {
    while (isWriting){}
    fs.readFile("state.json", (err, data) => {
        if (err){
            console.log("READ ERROR: ", err)
            event.reply(LOAD_STATE, null)
            return
        }
        const state: ReturnType<typeof store.getState> = JSON.parse(data.toString())
        event.reply(LOAD_STATE, state)
    })
}

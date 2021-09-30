import cp from "child_process"
import kill from "tree-kill"
import ps from "ps-node"
import {ipcMain} from "electron";
import {RECORDING_STOPPED} from "../events";

type ProcessDict = {[key: string]: cp.ChildProcess}

class ProcessManager {
    queue: ProcessDict
    constructor() {
        this.queue = {}
        ipcMain.on(RECORDING_STOPPED, (event, youtubeId: string) => {
            this.killProcess(youtubeId)
        })
    }
    addToDict = (youtubeId: string, process: cp.ChildProcess) => {
        if (this.queue[youtubeId] !== undefined){
            throw "This process exists"
        }
        this.queue[youtubeId] = process
    }
    removeFromDict = (youtubeId: string) => {
        delete this.queue[youtubeId]
    }
    killAllProcess = () => {
        Object.keys(this.queue).forEach(key => {
            this.killProcess(key)
        })
    }
    killProcess = (youtubeId: string) => {
        if (this.queue[youtubeId].killed){
            return
        }
        kill(this.queue[youtubeId].pid, "SIGINT", (err) => {
            console.error(err)
        })
        delete this.queue[youtubeId]
    }
    countProcess = (): number => {
        return Object.keys(this.queue).length
    }
}

let processManager: ProcessManager;

export const initProcessManager = (): ProcessManager => {
    processManager = new ProcessManager()
    return processManager
}

export const getProcessManager = (): ProcessManager => {
    return processManager
}

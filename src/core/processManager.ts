import cp from "child_process"
import kill from "tree-kill"
import {ipcMain} from "electron";
import {STOP_RECORDING} from "../events";

type ProcessDict = { [key: string]: cp.ChildProcess }

class ProcessManager {
    queue: ProcessDict

    constructor() {
        this.queue = {}
        ipcMain.on(STOP_RECORDING, (event, youtubeId: string) => {
            this.killProcess(youtubeId)
        })
    }

    addToDict = (youtubeId: string, process: cp.ChildProcess) => {
        if (this.queue[youtubeId] !== undefined) {
            delete this.queue[youtubeId]
            this.killProcess(youtubeId)
        }
        this.queue[youtubeId] = process
    }
    removeFromDict = (youtubeId: string) => {
        delete this.queue[youtubeId]
    }
    killAllProcess = () => new Promise<void>((resolve, _) => {
        Object.keys(this.queue).forEach(key => {
            this.killProcess(key)
        })
        resolve()
    })

    killProcess = (youtubeId: string) => {
        if (this.queue[youtubeId].killed) {
            return
        }
        kill(this.queue[youtubeId].pid, "SIGINT", (err) => {
            delete this.queue[youtubeId]
            if (err) {
                console.error(err)
                return
            }
        })
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

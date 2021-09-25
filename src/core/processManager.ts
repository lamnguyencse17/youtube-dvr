import cp from "child_process"
import kill from "tree-kill"

type ProcessDict = {[key: string]: cp.ChildProcess}

class ProcessManager {
    queue: ProcessDict
    constructor() {
        this.queue = {}
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
            if (this.queue[key].killed){
                return
            }
            kill(this.queue[key].pid, "SIGINT", (err) => {
                console.error(err)
            })
            delete this.queue[key]
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

import { contextBridge, ipcRenderer } from "electron";
import ytdl from "ytdl-core";
import { Events } from "../../lib/events";

export type ContextBridgeApi = {
  exposedReadUrl: (url: string) => Promise<ytdl.videoInfo>;
};

const exposedApi: ContextBridgeApi = {
  exposedReadUrl: (url: string) => {
    ipcRenderer.send(Events.READ_URL_EVENT, url);
    return new Promise((resolve) => {
      ipcRenderer.once(
        Events.READ_URL_SUCCESS_EVENT,
        (event, data: ytdl.videoInfo) => resolve(data)
      );
    });
  },
};

contextBridge.exposeInMainWorld("api", exposedApi);

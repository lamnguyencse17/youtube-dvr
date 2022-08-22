import { contextBridge, ipcRenderer } from "electron";
import ytdl from "ytdl-core";
import { Events } from "../../lib/events";

type ProgressData = {
  progress: number | null;
  downloaded: number;
  total: number | null;
  current: number;
};

export type ContextBridgeApi = {
  exposedReadUrl: (url: string) => Promise<ytdl.videoInfo>;
  exposedDownloadVideo: (url: string) => Promise<boolean>;
  exposedOnDownloadVideoProgress: (
    callback: (data: ProgressData) => void
  ) => void;
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
  exposedDownloadVideo: (url: string) => {
    ipcRenderer.send(Events.DOWNLOAD_VIDEO_EVENT, url);
    return new Promise((resolve) => {
      ipcRenderer.once(
        Events.DOWNLOAD_VIDEO_STARTED_EVENT,
        (event, isStarted: boolean) => resolve(isStarted)
      );
    });
  },
  exposedOnDownloadVideoProgress: (callback: (data: ProgressData) => void) =>
    ipcRenderer.on(Events.DOWNLOAD_VIDEO_PROGRESS_EVENT, (event, data) =>
      callback(data)
    ),
};

contextBridge.exposeInMainWorld("api", exposedApi);

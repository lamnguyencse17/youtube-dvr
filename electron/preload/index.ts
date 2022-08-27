import { contextBridge, ipcRenderer } from "electron";
import { Events } from "../../libs/events";
import { Stat, VideoInfo } from "../../libs/types";
import { DEPENDENCIES_CHECK_STATUS } from "./types";

export type ProgressData = {
  id: string;
  progress: number | null;
  downloaded: number;
  total: number | null;
  current: number;
  isRecording: boolean;
};

export type StreamStatType = {
  id: string;
  location: string;
  isRecording: boolean;
} & Stat;

export type DownloadVideoRequestType = {
  videoId: string;
  formatId: string;
};

export type DependenciesCheckData = {
  status: DEPENDENCIES_CHECK_STATUS;
  message?: string;
};

export type ContextBridgeApi = {
  exposedReadUrl: (url: string) => Promise<VideoInfo>;
  exposedDownloadVideo: (
    downloadVideoRequest: DownloadVideoRequestType
  ) => Promise<boolean>;
  exposedStopDownloadingVideo: (videoId: string) => Promise<boolean>;
  exposedOnDownloadVideoProgress: (
    callback: (data: StreamStatType) => void
  ) => void;
  exposedOnDependenciesCheck: (
    callback: (data: DependenciesCheckData) => void
  ) => () => void;
  exposedOnStopDownloadingVideo: (
    callback: (data: StreamStatType) => void
  ) => void;
  exposedStartDependenciesCheck: () => void;
};

const exposedApi: ContextBridgeApi = {
  exposedReadUrl: (url: string) => {
    ipcRenderer.send(Events.READ_URL_EVENT, url);
    return new Promise((resolve) => {
      ipcRenderer.once(
        Events.READ_URL_SUCCESS_EVENT,
        (event, data: VideoInfo) => resolve(data)
      );
    });
  },
  exposedDownloadVideo: (downloadVideoRequest: DownloadVideoRequestType) => {
    ipcRenderer.send(Events.DOWNLOAD_VIDEO_EVENT, downloadVideoRequest);
    return new Promise((resolve) => {
      ipcRenderer.once(
        Events.DOWNLOAD_VIDEO_STARTED_EVENT,
        (event, isStarted: boolean) => resolve(isStarted)
      );
    });
  },
  exposedOnDownloadVideoProgress: (callback: (data: StreamStatType) => void) =>
    ipcRenderer.on(Events.DOWNLOAD_VIDEO_PROGRESS_EVENT, (event, data) =>
      callback(data)
    ),
  exposedStopDownloadingVideo: (videoId: string) => {
    ipcRenderer.send(Events.STOP_DOWNLOAD_VIDEO_EVENT, videoId);
    return new Promise((resolve) => {
      ipcRenderer.once(
        Events.STOP_DOWNLOAD_VIDEO_EVENT,
        (event, isStarted: boolean) => resolve(isStarted)
      );
    });
  },
  exposedOnStopDownloadingVideo: (callback: (data: StreamStatType) => void) =>
    ipcRenderer.on(Events.STOP_DOWNLOAD_VIDEO_SUCCESS_EVENT, (event, data) =>
      callback(data)
    ),
  exposedStartDependenciesCheck: () =>
    ipcRenderer.send(Events.START_DEPENDENCY_CHECK_EVENT),
  exposedOnDependenciesCheck: (
    callback: (data: DependenciesCheckData) => void
  ) => {
    ipcRenderer.on(Events.DEPENDENCY_CHECK_EVENT, (event, data) =>
      callback(data)
    );
    return () =>
      ipcRenderer.removeListener(Events.DEPENDENCY_CHECK_EVENT, callback);
  },
};

contextBridge.exposeInMainWorld("api", exposedApi);

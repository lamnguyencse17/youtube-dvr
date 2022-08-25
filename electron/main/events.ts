import { BrowserWindow, IpcMain } from "electron";
import { Events } from "../../libs/events";
import { DownloadVideoRequestType } from "../preload";
import {
  handleDownloadEvent,
  handleStopDownloadingEvent,
} from "./handlers/download";
import { handleReadUrl } from "./handlers/url";

const registerEvents = (ipcMain: IpcMain, mainWindow: BrowserWindow | null) => {
  ipcMain.on(Events.READ_URL_EVENT, handleReadUrl);
  ipcMain.on(
    Events.DOWNLOAD_VIDEO_EVENT,
    (event, downloadVideoRequest: DownloadVideoRequestType) =>
      handleDownloadEvent(event, mainWindow, downloadVideoRequest)
  );
  ipcMain.on(Events.STOP_DOWNLOAD_VIDEO_EVENT, (event, videoId: string) =>
    handleStopDownloadingEvent(event, mainWindow, videoId)
  );
};

export default registerEvents;

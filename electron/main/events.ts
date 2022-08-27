import { BrowserWindow, IpcMain } from "electron";
import { Events } from "../../libs/events";
import { DownloadVideoRequestType } from "../preload";
import { checkDependencies } from "./dependencies";
import {
  handleDownloadEvent,
  handleStopDownloadingEvent,
} from "./handlers/download";
import { handleReadUrl } from "./handlers/url";

let browserWindow: BrowserWindow | null = null;

const registerEvents = (ipcMain: IpcMain, mainWindow: BrowserWindow | null) => {
  if (mainWindow) {
    browserWindow = mainWindow;
  }
  ipcMain.on(Events.READ_URL_EVENT, handleReadUrl);
  ipcMain.on(
    Events.DOWNLOAD_VIDEO_EVENT,
    (event, downloadVideoRequest: DownloadVideoRequestType) =>
      handleDownloadEvent(event, mainWindow, downloadVideoRequest)
  );
  ipcMain.on(Events.STOP_DOWNLOAD_VIDEO_EVENT, (event, videoId: string) =>
    handleStopDownloadingEvent(event, mainWindow, videoId)
  );
  ipcMain.on(Events.START_DEPENDENCY_CHECK_EVENT, async () => {
    checkDependencies();
  });
};

export const sendEvent = (event: Events, data: any) => {
  if (!browserWindow) {
    throw new Error("Browser window is not initialized");
  }
  browserWindow?.webContents.send(event, data);
};

export default registerEvents;

import { BrowserWindow, IpcMain } from "electron";
import { Events } from "../../libs/events";
import {
  handleDownloadEvent,
  handleStopDownloadingEvent,
} from "./handlers/download";
import { handleReadUrl } from "./handlers/url";

const registerEvents = (ipcMain: IpcMain, mainWindow: BrowserWindow | null) => {
  ipcMain.on(Events.READ_URL_EVENT, handleReadUrl);
  ipcMain.on(Events.DOWNLOAD_VIDEO_EVENT, (event, videoId: string) =>
    handleDownloadEvent(event, mainWindow, videoId)
  );
  ipcMain.on(Events.STOP_DOWNLOAD_VIDEO_EVENT, (event, videoId: string) =>
    handleStopDownloadingEvent(event, mainWindow, videoId)
  );
};

export default registerEvents;

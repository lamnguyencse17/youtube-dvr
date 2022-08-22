import { BrowserWindow, IpcMain } from "electron";
import { Events } from "../../lib/events";
import ytdl from "ytdl-core";
import fs from "fs";

const registerEvents = (ipcMain: IpcMain, mainWindow: BrowserWindow | null) => {
  ipcMain.on(Events.READ_URL_EVENT, async (event, url) => {
    event.sender.send(
      Events.READ_URL_SUCCESS_EVENT,
      await ytdl.getBasicInfo(url)
    );
  });
  ipcMain.on(Events.DOWNLOAD_VIDEO_EVENT, async (event, url) => {
    if (!mainWindow) {
      event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, false);
      throw new Error("mainWindow is null");
    }
    event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, true);
    const stream = ytdl(url);
    stream.pipe(fs.createWriteStream("video.mp4"));
    stream.on("progress", (chunkLength, downloaded, total) => {
      mainWindow.webContents.send(Events.DOWNLOAD_VIDEO_PROGRESS_EVENT, {
        progress: total ? downloaded / total : null,
        downloaded,
        total,
        current: chunkLength,
      });
    });
  });
};

export default registerEvents;

import { IpcMain } from "electron";
import { Events } from "../../lib/events";
import ytdl from "ytdl-core";
import fs from "fs";

const registerEvents = (ipcMain: IpcMain) => {
  ipcMain.on(Events.READ_URL_EVENT, async (event, url) => {
    // try {
    //   ytdl(url).pipe(fs.createWriteStream("video.mp4"));
    // } catch (err) {
    //   console.log(err);
    // }
    event.sender.send(
      Events.READ_URL_SUCCESS_EVENT,
      await ytdl.getBasicInfo(url)
    );
  });
};

export default registerEvents;

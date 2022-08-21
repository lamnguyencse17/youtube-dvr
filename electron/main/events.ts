import { IpcMain } from "electron";
import { Events } from "../../lib/events";
import ytdl from "ytdl-core";

const registerEvents = (ipcMain: IpcMain) => {
  ipcMain.on(Events.READ_URL_EVENT, async (event, url) => {
    event.sender.send(
      Events.READ_URL_SUCCESS_EVENT,
      await ytdl.getBasicInfo(url)
    );
  });
};

export default registerEvents;

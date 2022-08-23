import { IpcMainEvent } from "electron";
import ytdl from "ytdl-core";
import { Events } from "../../../libs/events";
import { videoCache } from "../cache";

export const handleReadUrl = async (event: IpcMainEvent, url: string) => {
  try {
    const videoInfo = await ytdl.getBasicInfo(url);
    event.sender.send(Events.READ_URL_SUCCESS_EVENT, videoInfo);
    const isSuccess = videoCache.set(videoInfo.videoDetails.videoId, videoInfo);
    if (!isSuccess) {
      console.error(
        `Cache for video id ${videoInfo.videoDetails.videoId} failed`
      );
    }
  } catch (err) {
    console.error(err);
    event.sender.send(Events.READ_URL_FAIL_EVENT, "Something went wrong");
  }
};

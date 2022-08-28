import { IpcMainEvent } from "electron";
import { Events } from "../../../libs/events";
import { videoCache } from "../cache";
import logger from "../logger";
import camelcaseKeys from "camelcase-keys";
import { RawVideoInfo } from "../../../libs/types";
import { execReadInfo } from "../yt-dlp";

export const handleReadUrl = async (event: IpcMainEvent, url: string) => {
  try {
    const output = await execReadInfo(url);
    const { videoInfo, rawInfo } = parseOutput(output);
    // logger.info({ videoInfo, rawInfo });
    cacheVideoInfo(rawInfo.id, rawInfo);
    event.sender.send(Events.READ_URL_SUCCESS_EVENT, videoInfo);
  } catch (err) {
    logger.error(
      { url, err },
      `Something went wrong during getting infos for url ${url}`
    );
    event.sender.send(Events.READ_URL_FAIL_EVENT, "Something went wrong");
  }
};

const parseOutput = (output: string) => {
  const video = camelcaseKeys(JSON.parse(output), { deep: true });
  const {
    id,
    thumbnails,
    isLive,
    description,
    formats,
    categories,
    webpageUrl,
  } = video as RawVideoInfo;
  const cleanedFormats = formats.map((format) => {
    delete format.fragments;
    delete format.url;
    return format;
  });
  const videoInfo = {
    id: id,
    url: webpageUrl,
    thumbnails,
    title: video.fulltitle,
    isLive,
    author: {
      id: video.channelID,
      name: video.channel,
      subscriberCount: video.channelFollowerCount,
      url: video.channelURL,
    },
    description,
    formats: cleanedFormats,
    categories,
  };
  return { videoInfo, rawInfo: video };
};

const cacheVideoInfo = (id: string, videoInfo: RawVideoInfo) => {
  const isSuccess = videoCache.set(id, videoInfo);
  if (!isSuccess) {
    logger.error(
      { id, url: videoInfo.webpageUrl },
      `Cache for video id ${videoInfo.id} failed`
    );
    return;
  }
  logger.info(
    { id, url: videoInfo.webpageUrl },
    `Cache for video id ${videoInfo.id} success`
  );
};

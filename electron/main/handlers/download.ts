import { BrowserWindow, dialog, IpcMainEvent } from "electron";
import ytdl from "ytdl-core";
import fs from "fs";
import { streamCache, StreamCacheType, videoCache } from "../cache";
import { ProgressValueType } from "../../../src/context/progress";
import { Events } from "../../../libs/events";
import logger from "../logger";

export const handleDownloadEvent = async (
  event: IpcMainEvent,
  mainWindow: BrowserWindow | null,
  videoId: string
) => {
  if (streamCache.get<StreamCacheType>(videoId)) {
    console.log("Video is already downloading");
    event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, false);
    return;
  }
  if (!mainWindow) {
    event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, false);
    logger.error(
      {
        stack: new Error().stack,
        id: videoId,
      },
      "mainWindow is null"
    );
    return;
  }
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow);
  if (canceled || !filePath) {
    return;
  } else {
    logger.info({ filePath }, "File path successfully identifed");
  }
  event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, true);
  let videoInfo = videoCache.get<ytdl.videoInfo>(videoId);
  if (!videoInfo) {
    console.error(`Failed to get cache for video id ${videoId}`);
    videoInfo = await ytdl.getBasicInfo(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    const isSuccess = videoCache.set(videoInfo.videoDetails.videoId, videoInfo);
    if (!isSuccess) {
      console.error(
        `Cache for video id ${videoInfo.videoDetails.videoId} failed`
      );
    }
  }
  const stream = ytdl(videoInfo.videoDetails.video_url);
  stream.pipe(fs.createWriteStream(filePath));
  stream.on("progress", (chunkLength, downloaded, total) => {
    const progressData: ProgressValueType = {
      progress: total ? downloaded / total : null,
      downloaded,
      total,
      current: chunkLength,
      id: videoId,
      isRecording: true,
    };
    streamCache.set<StreamCacheType>(videoId, {
      id: videoId,
      stream,
      progress: progressData,
    });
    mainWindow.webContents.send(
      Events.DOWNLOAD_VIDEO_PROGRESS_EVENT,
      progressData
    );
  });
};

export const handleStopDownloadingEvent = async (
  event: IpcMainEvent,
  mainWindow: BrowserWindow | null,
  videoId: string
) => {
  try {
    const streamController = streamCache.get<StreamCacheType>(videoId);
    if (!streamController) {
      logger.error(
        { id: videoId },
        `Stream controller for video ${videoId} is not available`
      );
      event.sender.send(Events.STOP_DOWNLOAD_VIDEO_EVENT, false);
      return;
    }
    streamController.stream.destroy();
    logger.info(
      { id: videoId },
      `Stream controller for video ${videoId} is destroyed`
    );
    const deleted = streamCache.del(videoId);
    if (deleted !== 1) {
      logger.fatal(
        { id: videoId, deleted },
        `Stream controller for video ${videoId} deleted more different than one???`
      );
    }
    if (!mainWindow) {
      event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, false);
      logger.error(
        {
          stack: new Error().stack,
          id: videoId,
        },
        "mainWindow is null"
      );
      return;
    }
    mainWindow.webContents.send(
      Events.STOP_DOWNLOAD_VIDEO_SUCCESS_EVENT,
      streamController.progress
    );
  } catch (err) {
    logger.error(
      err,
      "Something went wrong while executing handleStopDownloadingEvent"
    );
  }
};

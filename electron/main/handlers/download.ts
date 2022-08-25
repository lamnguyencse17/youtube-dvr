import { BrowserWindow, dialog, IpcMainEvent } from "electron";
import { processCache, streamCache, videoCache } from "../cache";
import { Events } from "../../../libs/events";
import { DownloadVideoRequestType, StreamStatType } from "../../preload";
import logger from "../logger";
import { execDownloadVideo, execReadInfo } from "../yt-dlp";
import { RawStat, RawVideoInfo, Stat } from "../../../libs/types";
import camelcaseKeys from "camelcase-keys";
import path from "path";
import kill from "tree-kill";
import { ROOT_PATH } from "..";

export const handleDownloadEvent = async (
  event: IpcMainEvent,
  mainWindow: BrowserWindow | null,
  { videoId, formatId }: DownloadVideoRequestType
) => {
  try {
    logger.info(
      { videoId, formatId },
      "Recieved download request with following arguments"
    );
    if (streamCache.get<StreamStatType>(videoId)) {
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
    let videoInfo = videoCache.get<RawVideoInfo>(videoId);
    if (!videoInfo) {
      console.error(`Failed to get cache for video id ${videoId}`);
      const output = await execReadInfo(constructUrlFromVideoId(videoId));
      videoInfo = camelcaseKeys(JSON.parse(decodeURI(output)), {
        deep: true,
      }) as RawVideoInfo;
      const isSuccess = videoCache.set(videoInfo.id, videoInfo);
      if (!isSuccess) {
        console.error(`Cache for video id ${videoInfo.id} failed`);
      }
    }
    const selectedVideo = videoInfo.formats.find(
      (format) => format.formatId === formatId
    );
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: path.join(
        ROOT_PATH.home,
        videoInfo.fulltitle && selectedVideo
          ? videoInfo.fulltitle + "." + selectedVideo.videoExt
          : "video.unknown"
      ),
    });
    if (canceled || !filePath) {
      return;
    } else {
      logger.info({ filePath }, "File path successfully identifed");
    }
    const fileName = path.basename(filePath);
    const location = path.dirname(filePath);
    const ytdlProcess = await execDownloadVideo(
      videoInfo.webpageUrl,
      formatId,
      location,
      fileName
    );
    processCache[videoInfo.id] = ytdlProcess;
    event.sender.send(Events.DOWNLOAD_VIDEO_STARTED_EVENT, true);
    if (ytdlProcess.stderr) {
      ytdlProcess.stderr.setEncoding("utf8");
      ytdlProcess.stderr.on("data", (data) => {
        // Debug info is considered stderr???
        if (data.includes("frame")) {
          const stat = parseRawStat(data);
          const streamInfo = {
            id: videoId,
            isRecording: true,
            location: filePath,
            ...stat,
          };
          streamCache.set<StreamStatType>(videoId, streamInfo);
          // logger.info(streamInfo, "PROCESSING STAT DATA");
          mainWindow.webContents.send(
            Events.DOWNLOAD_VIDEO_PROGRESS_EVENT,
            streamInfo
          );
        }
      });
    }
  } catch (err) {
    logger.error(err, "SOMETHING WENT WRONG WHILE REQUESTING DOWNLOAD");
  }
};

export const handleStopDownloadingEvent = async (
  event: IpcMainEvent,
  mainWindow: BrowserWindow | null,
  videoId: string
) => {
  try {
    const stat = streamCache.get<StreamStatType>(videoId);
    const streamProcess = processCache[videoId];
    if (!streamProcess) {
      logger.error(
        { id: videoId },
        `Stream process for video ${videoId} is not available`
      );
      event.sender.send(Events.STOP_DOWNLOAD_VIDEO_EVENT, false);
      return;
    }
    if (!streamProcess.pid) {
      throw new Error(
        `Stream process for video ${videoId} cannot be killed: PID not found`
      );
    }
    kill(streamProcess.pid, "SIGINT", (err) => {
      if (err) {
        throw err;
      }
    });
    delete processCache[videoId];
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
    mainWindow.webContents.send(Events.STOP_DOWNLOAD_VIDEO_SUCCESS_EVENT, {
      ...stat,
      isRecording: false,
    });
  } catch (err) {
    logger.error(
      { err, id: videoId },
      "Something went wrong while executing handleStopDownloadingEvent"
    );
  }
};

const constructUrlFromVideoId = (id: string) =>
  "https://www.youtube.com/watch?v=" + id;

const parseRawStat = (rawStat: string): Stat => {
  const statLines = rawStat.replace(/=\s+/g, "=").split(" ");
  const stat = {} as RawStat;

  statLines.forEach((line) => {
    const [key, value] = line.split("=");
    stat[key] = value;
  });
  return {
    frame: parseInt(stat.frame),
    fps: parseInt(stat.frame),
    q: parseInt(stat.q),
    size: {
      value: parseInt(stat.size.slice(0, stat.size.length - 2)),
      unit: "kB",
      text: stat.size,
    },
    time: stat.time,
    bitrate: {
      value: parseInt(stat.bitrate.slice(0, stat.bitrate.length - 2)),
      unit: "kbits/s",
      text: stat.bitrate,
    },
    speed: stat.speed,
  };
};

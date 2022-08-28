import { logger } from "./logger";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { exec as childExec } from "child_process";
import { downloadFileFromUrl, unzipFfmpeg } from "./utils";
import { DEPENDENCIES_CHECK_STATUS } from "../preload/types";
import { sendEvent } from "./events";
import { ROOT_PATH } from "./config";
import { Events } from "../../libs/events";

const exec = promisify(childExec);
const access = promisify(fs.access);

const ytdlInfo =
  "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";
const ffmpegInfo =
  "https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";

export const checkDependencies = async () => {
  sendEvent(Events.DEPENDENCY_CHECK_EVENT, {
    status: DEPENDENCIES_CHECK_STATUS.STARTED,
  });
  logger().info("CHECKING FOR DEPENDENCIES");
  Promise.allSettled([handleYtdlDependency(), handleFfmpegDependency()])
    .then(() => {
      logger().info("FINISH CHECKING DEPENDENCIES");
      sendEvent(Events.DEPENDENCY_CHECK_EVENT, {
        status: DEPENDENCIES_CHECK_STATUS.SUCCESS,
      });
    })
    .catch((err) => {
      logger().error({ err }, "ERROR WHILE CHECKING DEPENDENCIES");
      sendEvent(Events.DEPENDENCY_CHECK_EVENT, {
        status: DEPENDENCIES_CHECK_STATUS.ERROR,
      });
    });
};

const handleYtdlDependency = async () => {
  const ytdlPath = path.join(ROOT_PATH.bin, "yt-dlp.exe");
  try {
    await access(ytdlPath, fs.constants.F_OK);
    const { stderr } = await exec(`${ytdlPath} --version`);
    if (stderr === "") {
      const { stderr } = await exec(`${ytdlPath} -U`);
      if (stderr === "") {
        logger().info("UPDATE YTDL SUCCESSFULLY OR UP-TO-DATE");
      }
    }
  } catch (err) {
    logger().info("YTDL NOT FOUND. DOWNLOADING");
    await downloadFileFromUrl(ytdlInfo, ytdlPath);
    logger().info("FINISH PULLING YT-DLP");
  }
};

const handleFfmpegDependency = async () => {
  const ffmpegPath = path.join(ROOT_PATH.bin, "ffmpeg.exe");

  try {
    await access(ffmpegPath, fs.constants.F_OK);
    logger().info("FFMPEG WAS FOUND");
  } catch (err) {
    logger().info("FFMPEG NOT FOUND. DOWNLOADING");
    const fileName = "ffmpeg.zip";
    const ffmpegZipPath = path.join(ROOT_PATH.bin, fileName);
    await downloadFileFromUrl(ffmpegInfo, ffmpegZipPath);
    try {
      await unzipFfmpeg(ffmpegZipPath);
      logger().info("FINISH PULLING FFMPEG");
    } catch (err) {
      logger().info("FAILED TO FINISH UNZIP FFMPEG");
      throw err;
    }
  }
};

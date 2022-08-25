import path from "path";
import { ROOT_PATH } from ".";
import { exec as childExec } from "child_process";
import { promisify } from "util";
import logger from "./logger";
import fs from "fs";

const exec = promisify(childExec);
const access = promisify(fs.access);

export const execReadInfo = async (url: string) => {
  const ytdlPath = path.join(ROOT_PATH.bin, "yt-dlp.exe");
  const { stdout, stderr } = await exec(
    `${ytdlPath} --skip-download --dump-json ${url}`
  );
  if (stderr !== "") {
    throw new Error(stderr);
  }
  return stdout;
};

export const execDownloadVideo = async (
  url: string,
  formatId: string,
  location: string,
  fileName: string
) => {
  const ytdlPath = path.join(ROOT_PATH.bin, "yt-dlp.exe");
  const ffmpegPath = path.join(ROOT_PATH.bin, "ffmpeg.exe");
  await access(ytdlPath, fs.constants.F_OK);
  await access(ffmpegPath, fs.constants.F_OK);
  logger.info("FFMPEG and YTDL path exists");
  const filter = `-f "${formatId},ba"`; //ba stands for best audio
  const ffmpegLocation = `--ffmpeg-location ${ffmpegPath}`;
  const outputName = `-o "${fileName}"`;
  const saveLocation = `-P ${location}`;
  const command = `${ytdlPath} ${saveLocation} ${outputName} ${filter} ${ffmpegLocation} --windows-filenames --no-overwrites --continue ${url}`;
  logger.info(`DOWNLOADING WITH THIS COMMAND ${command}`);
  return childExec(command);
};

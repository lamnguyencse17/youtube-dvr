import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import yauzl from "yauzl";
import { ROOT_PATH } from "./config";
import { tempLogger, logger } from "./logger";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

export const downloadFileFromUrl = async (url: string, path: string) => {
  const file = fs.createWriteStream(path);
  const res = await fetch(url);
  return new Promise<void>((resolve, reject) => {
    if (res.body) {
      res.body
        .pipe(file)
        .on("finish", () => {
          file.close();
          resolve();
        })
        .on("error", (err) => {
          fs.unlink(path, (err) => {
            reject(err);
          });
          reject(err);
        });
    }
  });
};

export const unzipFfmpeg = (zipPath: string) =>
  new Promise<void>((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipFile) => {
      if (err) {
        reject(err);
      }
      zipFile.readEntry();
      zipFile.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipFile.readEntry();
        } else {
          if (!/^[^.]+.exe$/.test(entry.fileName)) {
            zipFile.readEntry();
            return;
          }
          zipFile.openReadStream(entry, function (err, readStream) {
            if (err) throw err;
            readStream.on("end", () => {
              zipFile.readEntry();
            });
            const streamFile = fs.createWriteStream(
              path.join(ROOT_PATH.bin, path.basename(entry.fileName))
            );
            readStream.pipe(streamFile);
          });
        }
      });
      zipFile.on("end", () => {
        logger().info("CLEANING DOWNLOADED FFMPEG ZIP");
        fs.unlink(zipPath, (err) => {
          reject(err);
        });
        resolve();
      });
      zipFile.on("error", (err) => {
        reject(err);
      });
    });
  });

export const ensureAppDataDir = async () => {
  const appDataPath = ROOT_PATH.appData;
  const binPath = ROOT_PATH.bin;
  const logPath = ROOT_PATH.logs;
  try {
    await access(appDataPath);
  } catch (err) {
    tempLogger.error(err, "MISSING SOME DIRECTORIES");
    try {
      await mkdir(appDataPath, { recursive: true });
    } catch (err) {
      tempLogger.error(err, "ERROR WHILE CREATING APPDATA DIRECTORY");
    }
  }
  try {
    await access(binPath);
  } catch (err) {
    tempLogger.error(err, "MISSING BIN DIRECTORY");
    try {
      await mkdir(binPath, { recursive: true });
    } catch (err) {
      tempLogger.error(err, "ERROR WHILE CREATING BIN DIRECTORY");
    }
  }
  try {
    await access(logPath);
  } catch (err) {
    tempLogger.error(err, "MISSING LOG DIRECTORY");
    try {
      await mkdir(logPath, { recursive: true });
    } catch (err) {
      tempLogger.error(err, "ERROR WHILE CREATING LOG DIRECTORY");
    }
  }
};

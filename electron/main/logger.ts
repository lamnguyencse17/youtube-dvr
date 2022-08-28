import pino, { Logger } from "pino";
import { app } from "electron";
import path from "path";
import { ROOT_PATH } from "./config";
import fs from "fs";

export const tempLogger = pino(
  pino.destination(path.join(ROOT_PATH.temp, `./youtubedvr.log`))
);

const fileName = `./debug-${new Date().getTime()}.log`;

let internalLogger: Logger | null = null;

export const initLogger = () => {
  try {
    fs.accessSync(ROOT_PATH.logs, fs.constants.F_OK);
  } catch (err) {
    tempLogger.error(err, "MISSING LOG DIRECTORY");
    try {
      fs.mkdirSync(ROOT_PATH.logs, { recursive: true });
    } catch (err) {
      tempLogger.error(err, "ERROR WHILE CREATING LOG DIRECTORY");
    }
  }
  internalLogger =
    process.env.NODE_ENV === "production" || app.isPackaged
      ? pino(pino.destination(path.join(ROOT_PATH.logs, fileName)))
      : pino(
          {
            transport: {
              target: "pino-pretty",
            },
          },
          pino.multistream([
            { stream: process.stdout },
            pino.destination("./debug.log"),
          ])
        );
  return internalLogger;
};

export const logger = () => {
  if (!internalLogger) {
    return initLogger();
  }
  return internalLogger;
};

const a = logger();

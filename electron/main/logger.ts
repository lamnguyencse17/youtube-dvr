import pino, { Logger } from "pino";
import { app } from "electron";

let logger: Logger;
if (process.env.NODE_ENV === "production" || app.isPackaged) {
  logger = pino(pino.destination("./debug.log"));
} else {
  logger = pino(
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
}

export default logger;

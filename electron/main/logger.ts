import pino from "pino";
import fs from "fs";

const logger = pino(
  {
    transport: {
      target: "pino-pretty",
    },
  },
  pino.multistream([
    { stream: process.stdout },
    { stream: fs.createWriteStream("./debug.log", { flags: "a" }) },
  ])
);

export default logger;

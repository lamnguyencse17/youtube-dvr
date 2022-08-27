import { app } from "electron";
import { homedir } from "os";
import { join } from "path";

export const ROOT_PATH = {
  dist: join(__dirname, "../.."),
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
  bin: app.isPackaged
    ? join(process.resourcesPath, "../bin")
    : join(__dirname, "../../../bin"),
  home: homedir(),
};

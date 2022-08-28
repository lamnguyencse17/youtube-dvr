import { app } from "electron";
import { homedir, tmpdir } from "os";
import { join } from "path";

console.log(tmpdir());
const rootAppData = app.getPath("appData");
const appData = join(rootAppData, app.getName());
export const ROOT_PATH = {
  dist: join(__dirname, "../.."),
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
  bin: app.isPackaged
    ? join(appData, "./bin")
    : join(__dirname, "../../../bin"),
  home: homedir(),
  appData: join(rootAppData, app.getName()),
  temp: app.getPath("temp"),
  logs: join(appData, "./logs"),
};

import NodeCache from "node-cache";
import cp from "child_process";

export const videoCache = new NodeCache();
export const streamCache = new NodeCache();
export const processCache: { [key: string]: cp.ChildProcess } = {};

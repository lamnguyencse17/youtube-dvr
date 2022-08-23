import NodeCache from "node-cache";
import { ProgressValueType } from "../../src/context/progress";
import { Readable } from "stream";

export const videoCache = new NodeCache();
export const streamCache = new NodeCache();

export type StreamCacheType = {
  id: string;
  stream: Readable;
  progress: ProgressValueType;
};

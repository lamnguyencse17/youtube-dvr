import { createContext } from "react";
import ytdl from "ytdl-core";

export const VideoContext = createContext<VideoContextType>({
  videos: {},
  setVideo: () => {},
});

export type VideoValueType = {
  url: string;
  id: string;
  title: string;
  thumbnails: ytdl.thumbnail[];
  isLive: boolean;
  isLiveContent: boolean;
  author: ytdl.Author;
  description: string | null;
  formats: ytdl.videoFormat[];
};

export type VideoType = {
  [key: string]: VideoValueType;
};

export type VideoContextType = {
  videos: VideoType;
  setVideo: (id: string, value: VideoValueType) => void;
};

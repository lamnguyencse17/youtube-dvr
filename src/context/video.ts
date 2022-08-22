import { createContext } from "react";
import ytdl from "ytdl-core";

export const VideoContext = createContext<VideoContextType>({
  videos: {},
  setVideo: () => {},
});

export type VideoType = {
  url: string;
  id: string;
  title: string;
  thumbnails: ytdl.thumbnail[];
  isLive: boolean;
  isLiveContent: boolean;
  author: ytdl.Author;
  description: string | null;
};

export type VideoValue = {
  [key: string]: VideoType;
};

export type VideoContextType = {
  videos: VideoValue;
  setVideo: (id: string, value: VideoType) => void;
};

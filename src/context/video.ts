import { Format, Thumbnail } from "libs/types";
import { createContext } from "react";

export const VideoContext = createContext<VideoContextType>({
  videos: {},
  setVideo: () => {},
});

export type VideoValueType = {
  url: string;
  id: string;
  title: string;
  thumbnails: Thumbnail[];
  isLive: boolean;
  author: AuthorType;
  description: string | null;
  formats: Format[];
};

export type AuthorType = {
  id: string;
  name: string;
  subscriberCount: number;
  url: string;
};

export type VideoType = {
  [key: string]: VideoValueType;
};

export type VideoContextType = {
  videos: VideoType;
  setVideo: (id: string, value: VideoValueType) => void;
};

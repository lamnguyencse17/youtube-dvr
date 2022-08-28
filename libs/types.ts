export interface VideoInfo {
  id: string;
  url: string;
  thumbnails: Thumbnail[];
  title: string;
  isLive: boolean;
  author: Author;
  description: string;
  formats: Format[];
  categories: string[];
}

export interface Author {
  id: string;
  url: string;
  name: string;
  subscriberCount: number;
}

export interface RawVideoInfo extends Omit<VideoInfo, "author"> {
  id: string;
  title: string;
  formats: Format[];
  thumbnails: Thumbnail[];
  thumbnail: string;
  description: string;
  uploader: string;
  uploaderId: string;
  uploaderUrl: string;
  channelId: string;
  channelUrl: string;
  viewCount: number;
  averageRating: null;
  ageLimit: number;
  webpageUrl: string;
  categories: string[];
  tags: string[];
  playableInEmbed: boolean;
  isLive: boolean;
  wasLive: boolean;
  liveStatus: string;
  releaseTimestamp: number;
  automaticCaptions: AutomaticCaptions;
  subtitles: Subtitles;
  commentCount: null;
  chapters: null;
  likeCount: number;
  channel: string;
  channelFollowerCount: number;
  uploadDate: string;
  availability: string;
  originalUrl: string;
  webpageUrlBasename: string;
  webpageUrlDomain: string;
  extractor: string;
  extractorKey: string;
  playlist: null;
  playlistIndex: null;
  displayID: string;
  fulltitle: string;
  releaseDate: string;
  requestedSubtitles: null;
  hasDrm: null;
  formatId: string;
  formatIndex: null;
  url: string;
  manifestURL: string;
  tbr: number;
  ext: string;
  fps: number;
  protocol: string;
  preference: null;
  quality: number;
  width: number;
  height: number;
  vcodec: string;
  acodec: string;
  dynamicRange: string;
  videoExt: string;
  audioExt: string;
  vbr: number;
  abr: number;
  format: string;
  resolution: string;
  httpHeaders: HTTPHeaders;
  epoch: number;
  filename: string;
  videoInfoFilename: string;
  urls: string;
  type: string;
}

export interface AutomaticCaptions {}

export interface Format {
  formatId: string;
  formatIndex: null;
  url?: string;
  manifestURL: string;
  tbr: number;
  ext: string;
  fps: number;
  protocol: string;
  preference: null;
  quality: number;
  width: number;
  height: number;
  vcodec: string;
  acodec: string;
  dynamicRange: string;
  videoExt: string;
  audioExt: string;
  vbr: number;
  abr: number;
  format: string;
  resolution: string;
  httpHeaders: HTTPHeaders;
  filesizeApprox?: number;
  fragments?: any;
}

export interface HTTPHeaders {
  userAgent: string;
  accept: string;
  acceptLanguage: string;
  secFetchMode: string;
}

export interface Subtitles {
  liveChat: LiveChat[];
}

export interface LiveChat {
  url: string;
  videoId: string;
  ext: string;
  protocol: string;
}

export interface Thumbnail {
  url: string;
  preference: number;
  id: string;
  height?: number;
  width?: number;
  resolution?: string;
}

export type RawStat = {
  frame: string;
  fps: string;
  q: string;
  size: string;
  time: string;
  bitrate: string;
  speed: string;
};

export type Stat = {
  frame: number;
  fps: number;
  q: number;
  size: {
    value: number;
    unit: string;
    text: string;
  };
  time: string;
  bitrate: {
    value: number;
    unit: string;
    text: string;
  };
  speed: string;
};

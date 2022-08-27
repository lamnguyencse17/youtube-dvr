import { StreamStatType } from "electron/preload";
import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { StreamContext, StatType } from "./context/stream";
import { VideoContext, VideoType, VideoValueType } from "./context/video";
import Layout from "./layout";

const Provider = () => {
  const [videos, setVideos] = useState<VideoType>({});
  const [streams, setStreams] = useState<StatType>({});

  const setVideo = (id: string, value: VideoValueType) => {
    const newVideos = { ...videos };
    newVideos[id] = value;
    setVideos({ ...newVideos });
  };

  const setSingleStream = (id: string, value: StreamStatType) => {
    const newProgresses = { ...streams };
    newProgresses[id] = value;
    setStreams({ ...newProgresses });
  };

  useEffect(() => {
    window.api.exposedOnDownloadVideoProgress((streamStat) => {
      setSingleStream(streamStat.id, { ...streamStat });
    });
    window.api.exposedOnStopDownloadingVideo((streamStat) => {
      setSingleStream(streamStat.id, { ...streamStat });
    });
  }, []);

  useEffect(() => {
    console.log(streams);
  }, [streams]);

  return (
    <HashRouter>
      <VideoContext.Provider value={{ videos, setVideo }}>
        <StreamContext.Provider value={{ streams, setSingleStream }}>
          <Layout />
        </StreamContext.Provider>
      </VideoContext.Provider>
    </HashRouter>
  );
};

export default Provider;

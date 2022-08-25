import { Box, Flex } from "@chakra-ui/react";
import { StreamStatType } from "electron/preload";
import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import { StreamContext, StatType } from "./context/stream";
import { VideoContext, VideoType, VideoValueType } from "./context/video";
import Home from "./pages/home";
import Videos from "./pages/videos";

const Layout: React.FC = () => {
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
    <VideoContext.Provider value={{ videos, setVideo }}>
      <StreamContext.Provider value={{ streams, setSingleStream }}>
        <Flex direction="column" height="100%">
          <HashRouter>
            <Header />
            <Box flexGrow="1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/videos/*" element={<Videos />} />
              </Routes>
            </Box>
          </HashRouter>
        </Flex>
      </StreamContext.Provider>
    </VideoContext.Provider>
  );
};

export default Layout;

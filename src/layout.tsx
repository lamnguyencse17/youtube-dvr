import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import {
  ProgressContext,
  ProgressType,
  ProgressValueType,
} from "./context/progress";
import { VideoContext, VideoType, VideoValueType } from "./context/video";
import Home from "./pages/home";
import Videos from "./pages/videos";

const Layout: React.FC = () => {
  const [videos, setVideos] = useState<VideoType>({});
  const [progresses, setProgresses] = useState<ProgressType>({});

  const setVideo = (id: string, value: VideoValueType) => {
    const newVideos = { ...videos };
    newVideos[id] = value;
    setVideos({ ...newVideos });
  };

  const setProgress = (id: string, value: ProgressValueType) => {
    const newProgresses = { ...progresses };
    newProgresses[id] = value;
    setProgresses({ ...newProgresses });
  };

  useEffect(() => {
    window.api.exposedOnDownloadVideoProgress((progress) => {
      setProgress(progress.id, { ...progress, isRecording: true });
    });
    window.api.exposedOnStopDownloadingVideo((progress) => {
      setProgress(progress.id, { ...progress, isRecording: false });
    });
  }, []);

  useEffect(() => {
    console.log(progresses);
  }, [progresses]);

  return (
    <VideoContext.Provider value={{ videos, setVideo }}>
      <ProgressContext.Provider value={{ progresses, setProgress }}>
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
      </ProgressContext.Provider>
    </VideoContext.Provider>
  );
};

export default Layout;

import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import { VideoContext, VideoType, VideoValue } from "./context/video";
import Home from "./pages/home";
import Videos from "./pages/videos";

const Layout: React.FC = () => {
  const [videos, setVideos] = useState<VideoValue>({});
  const setVideo = (id: string, value: VideoType) => {
    const newVideos = { ...videos };
    newVideos[id] = value;
    setVideos({ ...newVideos });
  };
  return (
    <VideoContext.Provider value={{ videos, setVideo }}>
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
    </VideoContext.Provider>
  );
};

export default Layout;

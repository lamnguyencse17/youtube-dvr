import { Box } from "@chakra-ui/react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import SingleVideo from "./[id]";

export default function Videos() {
  return (
    <Routes>
      <Route index element={<VideosHome />} />
      <Route path="/:videoId" element={<SingleVideo />} />
    </Routes>
  );
}

const VideosHome = () => {
  return <Box>Videos</Box>;
};

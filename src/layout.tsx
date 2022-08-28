import Home from "./pages/home";
import Splash from "./pages/splash";
import Videos from "./pages/videos";
import Header from "./components/layout/header";
import { Box, Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Settings from "./pages/settings";

const Layout = () => {
  return (
    <Flex direction="column" height="100%">
      <Header />
      <Box flexGrow="1">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/videos/*" element={<Videos />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default Layout;

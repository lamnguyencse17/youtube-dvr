import { Box, Flex } from "@chakra-ui/react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import Home from "./pages/home";

const Layout: React.FC = () => {
  return (
    <Flex direction="column" height="100%">
      <Header />
      <Box flexGrow="1">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </HashRouter>
      </Box>
    </Flex>
  );
};

export default Layout;

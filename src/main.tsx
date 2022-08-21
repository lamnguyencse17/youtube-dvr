import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./layout";
import { ChakraProvider } from "@chakra-ui/react";
import "styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Layout />
    </ChakraProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");

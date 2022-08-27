import { Box, Flex, Heading, Spinner, Text, useToast } from "@chakra-ui/react";
import { DEPENDENCIES_CHECK_STATUS } from "../../electron/preload/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isError, setIsError] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.api.exposedStartDependenciesCheck();
    const deregisterDependencyCheck = window.api.exposedOnDependenciesCheck(
      (checkData) => {
        switch (checkData.status) {
          case DEPENDENCIES_CHECK_STATUS.SUCCESS: {
            setIsStarted(false);
            setIsSuccess(true);
            const timeout = setTimeout(() => {
              navigate("/home");
              clearTimeout(timeout);
            }, 3000);
            return;
          }
          case DEPENDENCIES_CHECK_STATUS.ERROR: {
            setIsError(true);
            return;
          }
          case DEPENDENCIES_CHECK_STATUS.STARTED: {
            setIsStarted(true);
            return;
          }
          default: {
            console.log(checkData);
          }
        }
      }
    );
    return () => {
      deregisterDependencyCheck();
    };
  }, []);
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      padding="5"
      gap={5}
    >
      <Heading textAlign="center" color="pink.400">
        YOUTUBE-DVR
      </Heading>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="pink.400"
        size="xl"
      />
      {isStarted && !isError && (
        <Text fontSize="md">
          Making sure that dependencies are available...
        </Text>
      )}
      {isSuccess && (
        <Text fontSize="lg" color="pink.400">
          Firing things up!!
        </Text>
      )}
      {isError && (
        <Text fontSize="md" color="red">
          Things are not working great. Please try to restart
        </Text>
      )}
    </Flex>
  );
};

export default Splash;

import { VideoContext } from "@/context/video";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  useDisclosure,
  List,
  ListItem,
  IconButton,
  Link as ChakraLink,
  Divider,
  Flex,
  Heading,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const { videos } = useContext(VideoContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  return (
    <Flex direction="row" gap={3} alignItems="center">
      <IconButton
        aria-label="Open menu"
        icon={<HamburgerIcon color="pink.400" />}
        ref={btnRef}
        onClick={onOpen}
        colorScheme="white"
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody padding="5">
            <Flex direction="column" gap={3}>
              <List spacing={5}>
                <ListItem>
                  <ChakraLink
                    as={Link}
                    to="/"
                    color={pathname === "/" ? "pink.400" : "black"}
                  >
                    Home
                  </ChakraLink>
                </ListItem>
                <ListItem>
                  <ChakraLink
                    as={Link}
                    to="/videos"
                    color={pathname === "/videos" ? "pink.400" : "black"}
                  >
                    Videos
                  </ChakraLink>
                </ListItem>
              </List>
              <Divider />
              <List spacing={3}>
                {Object.keys(videos).map((key) => (
                  <ListItem key={key}>
                    <ChakraLink
                      as={Link}
                      to={`/videos/${key}`}
                      color={
                        pathname === `/videos/${key}` ? "pink.400" : "black"
                      }
                    >
                      {videos[key].author.name}
                    </ChakraLink>
                  </ListItem>
                ))}
              </List>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Heading color="pink.400">Youtube DVR</Heading>
    </Flex>
  );
}

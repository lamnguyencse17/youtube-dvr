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
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const { videos } = useContext(VideoContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  return (
    <Box>
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
                  <ChakraLink as={Link} to="/">
                    Home
                  </ChakraLink>
                </ListItem>
                <ListItem>
                  <ChakraLink as={Link} to="/videos">
                    Videos
                  </ChakraLink>
                </ListItem>
              </List>
              <Divider />
              <List spacing={3}>
                {Object.keys(videos).map((key) => (
                  <ListItem key={key}>
                    <ChakraLink as={Link} to={`/videos/${key}`}>
                      {videos[key].author.name}
                    </ChakraLink>
                  </ListItem>
                ))}
              </List>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

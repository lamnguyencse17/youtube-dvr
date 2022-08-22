import { VideoContext } from "@/context/video";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Button,
  useDisclosure,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import React, { useContext } from "react";

export default function Header() {
  const { videos } = useContext(VideoContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  return (
    <Box>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <List>
              {Object.keys(videos).map((key) => (
                <ListItem key={key}>{videos[key].title}</ListItem>
              ))}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

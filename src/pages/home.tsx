import { VideoContext } from "@/context/video";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import ytdl from "ytdl-core";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface MoreVideoDetailsPatched extends ytdl.MoreVideoDetails {
  isLive: boolean;
}

export default function Home() {
  const { setVideo } = useContext(VideoContext);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const urlSchema = z.object({
    url: z
      .string()
      .url()
      .trim()
      .refine((val) => {
        const regex = /(youtu.*be.*)\/(watch\?v=|v|shorts|)(.*?((?=[&#?])|$))/;
        return regex.test(val);
      }),
  });

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: ({ url }) => {
      handleGetUrl(url);
    },
    validationSchema: toFormikValidationSchema(urlSchema),
  });

  const handleGetUrl = async (url: string) => {
    const data = await window.api.exposedReadUrl(url);
    console.log(data.videoDetails.thumbnails);
    const { videoId, video_url, title, thumbnails, isLive, isLiveContent } =
      data.videoDetails as MoreVideoDetailsPatched;
    setVideo(videoId, {
      id: videoId,
      url: video_url,
      thumbnails,
      title,
      isLive,
      isLiveContent,
    });
  };
  return (
    <Flex
      direction="column"
      height="100%"
      padding="5"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Insert your cool Youtube link here</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Flex
            direction="column"
            height="100%"
            padding="5"
            alignItems="center"
            justifyContent="center"
          >
            <Input
              id="url"
              name="url"
              type="url"
              variant="filled"
              onChange={handleChange}
              value={values.url}
            />
            <Button type="submit" colorScheme="pink">
              Start
            </Button>
          </Flex>
        </FormControl>
      </form>

      {videoId && (
        <Box w="100%" h="100%">
          <webview
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allowFullScreen
            style={{ height: "100%", width: "100%" }}
          />
        </Box>
      )}
    </Flex>
  );
}

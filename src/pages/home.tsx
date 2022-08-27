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
import { useContext, useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

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
    setVideo(data.id, data);
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
    </Flex>
  );
}

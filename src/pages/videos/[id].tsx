import { ProgressContext } from "@/context/progress";
import { VideoContext } from "@/context/video";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Link,
  Button,
  Divider,
  Select,
} from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ytdl from "ytdl-core";

const processDescription = (data: string) => {
  const lines = data.split("\n");
  return lines.map((line, index) => {
    const regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (regex.test(line)) {
      return (
        <Link href={line} isExternal color="pink.400" key={index}>
          {line}
        </Link>
      );
    }
    return <Text key={index}>{line}</Text>;
  });
};

export default function SingleVideo() {
  const { videoId } = useParams();
  const { videos } = useContext(VideoContext);
  const { progresses } = useContext(ProgressContext);

  const [showMore, setShowMore] = useState(false);
  if (!videoId) {
    return <div> Nope </div>;
  }
  const video = videos[videoId];
  const progress = progresses[videoId];

  const { author } = video;
  const descriptionLines = useMemo(() => {
    if (!video.description) {
      return [];
    }
    return processDescription(video.description);
  }, [video]);

  const handleDownloadVideo = async () => {
    const isSuccess = await window.api.exposedDownloadVideo(video.id);
    if (!isSuccess) {
      console.error("Failed to start downloading");
    }
  };

  const handleStopDownloadingVideo = async () => {
    const isSuccess = await window.api.exposedStopDownloadingVideo(video.id);
    if (!isSuccess) {
      console.error("Failed to stop downloading");
    }
  };

  const isRecording = !!progress && progress.isRecording;
  return (
    <Flex direction="column" w="100%" h="100%" padding="5" gap={3}>
      <Flex direction="row" justifyContent="end" gap={2}>
        <Select placeholder="Select option">
          {video.formats.map(
            (format) =>
              format.qualityLabel && (
                <option value={format.itag}>{format.qualityLabel}</option>
              )
          )}
        </Select>
        <Button
          onClick={
            progress && progress.isRecording
              ? handleStopDownloadingVideo
              : handleDownloadVideo
          }
          colorScheme="pink"
          variant="outline"
          isActive={isRecording}
        >
          {isRecording ? "Stop" : "Record"}
        </Button>
      </Flex>
      {video.isLive ? (
        <Grid templateColumns="repeat(6, 1fr)" gap={2} minHeight="300px">
          <GridItem colSpan={[6, 6, 4]} height="100%">
            <webview
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allowFullScreen
              style={{ height: "100%", width: "100%" }}
            />
          </GridItem>
          <GridItem colSpan={[6, 6, 2]} height="100%">
            <webview
              src={`https://www.youtube.com/live_chat?v=${videoId}`}
              title="YouTube video player"
              allowFullScreen
              style={{ width: "100%", height: "100%" }}
            />
          </GridItem>
        </Grid>
      ) : (
        <Box w="100%" minHeight="300px">
          <webview
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allowFullScreen
            style={{ height: "100%", width: "100%" }}
          />
        </Box>
      )}
      <Text fontSize="2xl">{video.title}</Text>
      <Flex direction="row" gap={3} alignItems="center" paddingX="1em">
        {author.thumbnails && (
          <Avatar
            name={author.name}
            src={author.thumbnails[author.thumbnails.length - 1].url}
          />
        )}
        <Flex direction="column">
          <Link href={author.channel_url} isExternal>
            <Flex direction="row" alignItems="center" gap={3}>
              <Text fontSize="xl">{author.name}</Text>
              <ExternalLinkIcon mx="2px" />
            </Flex>
          </Link>

          {author.subscriber_count && (
            <Text fontSize="lg">
              {author.subscriber_count / 1000}K Subscribers
            </Text>
          )}
        </Flex>
      </Flex>
      <Divider />
      <Flex direction="column">
        {showMore ? descriptionLines : descriptionLines.slice(0, 5)}
        <Button
          onClick={() => {
            setShowMore((prevShown) => !prevShown);
          }}
        >
          {showMore ? "Show less" : "Show more"}
        </Button>
      </Flex>
    </Flex>
  );
}

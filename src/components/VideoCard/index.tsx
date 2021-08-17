import { Content, VideoListStyle } from '@/lib/types'
import { Box, Heading, HStack, Image, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'

type Props = {
  content: Content
  listStyle: VideoListStyle
}

export const VideoCard: React.FC<Props> = (
  {
    content: { videoUrl, thumbnailUrl, videoTitle, videoTime, channelName, views, uploadedTime },
    listStyle,
  }
) => (
  <Box h={94} w='100%'>
    <LinkBox>
      <HStack>
        <Image src={thumbnailUrl} alt={videoTitle} htmlHeight={94} htmlWidth={168} />
        <Box>
          <LinkOverlay href={videoUrl}>
            <Heading noOfLines={2} fontSize='sm'>
              {videoTitle}
            </Heading>
          </LinkOverlay>
          <Text noOfLines={1} mt={4} fontSize='xs'>{channelName}</Text>
          <Text noOfLines={2} fontSize='xs'>{views} • {uploadedTime}</Text>
        </Box>
      </HStack>
    </LinkBox>
  </Box>
)

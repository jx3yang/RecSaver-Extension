import { useHoverBorderColor } from '@/hooks/useHoverBorderColor'
import { Content, VideoListStyle } from '@/lib/types'
import { Box, Flex, Heading, HStack, Image, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'

type Props = {
  content: Content
  listStyle: VideoListStyle
}

export const VideoCard: React.FC<Props> = (
  {
    content: { videoUrl, thumbnailUrl, videoTitle, videoTime, channelName, views, uploadedTime },
    listStyle,
  }
) => {
  const { normalColor, colorOnHover } = useHoverBorderColor()
  return (
    <Flex h='96px' w='100%' border='1px' borderColor={normalColor} _hover={{ borderColor: colorOnHover }} justifyContent='center' alignItems='center'>
      <Box h='94px' w='100%'>
        <LinkBox>
          <HStack>
            <Image
              src={thumbnailUrl}
              alt={videoTitle}
              htmlHeight='94px'
              htmlWidth='168px'
              zIndex='-10'
            />
            <Flex direction='column' h='94px'>
              <Box mb='auto !important'>
                <LinkOverlay href={videoUrl} isExternal>
                  <Heading noOfLines={2} fontSize='sm'>
                    {videoTitle}
                  </Heading>
                </LinkOverlay>
              </Box>
              <Box mt='auto !important'>
                <Text color='gray.500' noOfLines={1} mt={4} fontSize='xs'>{channelName}</Text>
                <Text color='gray.500' noOfLines={1} fontSize='xs'>{views} • {uploadedTime}</Text>
              </Box>
            </Flex>
          </HStack>
        </LinkBox>
      </Box>
    </Flex>
  )
}

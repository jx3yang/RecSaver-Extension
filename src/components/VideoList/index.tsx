import { Content, VideoListStyle } from '@/lib/types'
import { Center, Heading, VStack } from '@chakra-ui/react'
import { VideoCard } from '../VideoCard'

type Props = {
  contents: Content[]
  listStyle: VideoListStyle
}

export const VideoList: React.FC<Props> = ({ contents, listStyle }) => (
  contents.length > 0 ? (
    <VStack spacing={4}>
      {contents.map((content) =>
        <VideoCard
          content={content}
          listStyle={listStyle}
        />
      )}
    </VStack>
  ) : (
    <Center w='100%' h='400px'>
      <Heading color='gray.300'>
        No history yet
      </Heading>
    </Center>
  )
)

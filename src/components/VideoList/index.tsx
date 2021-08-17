import { Content, VideoListStyle } from '@/lib/types'
import { VStack } from '@chakra-ui/react'
import { VideoCard } from '../VideoCard'

type Props = {
  contents: Content[]
  listStyle: VideoListStyle
}

export const VideoList: React.FC<Props> = ({ contents, listStyle }) => (
  <VStack spacing={4}>
    {contents.map((content) => <VideoCard content={content} listStyle={listStyle} />)}
  </VStack>
)

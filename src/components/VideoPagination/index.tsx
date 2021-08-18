import { RecommendationsEntry, VideoListStyle } from '@/lib/types'
import { VideoList } from '@/components/VideoList'
import { useState } from 'react'
import { Box, Center, HStack, Spinner } from '@chakra-ui/react'
import { Pagination } from '../Pagination'

type Props = {
  history?: RecommendationsEntry[]
  listStyle: VideoListStyle
}

export const VideoPagination: React.FC<Props> = ({ history, listStyle }) => {
  if (!history)
    return (
      <Center w='100%' h='400px'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Center>
    )

  const [currentPage, setCurrentPage] = useState(1)
  const maxPage = history.length

  return (
    <>
      <Box pb={50}>
        <VideoList contents={history[currentPage - 1]?.contents || []} listStyle={listStyle} />
      </Box>
      <HStack
        position='fixed'
        bottom={0}
        left={0}
        w='100%'
        h={50}
        bgColor='white'
        zIndex={20}
        borderTop='1px'
        borderColor='gray.300'
      >
        <Box mx='auto'>
          <Pagination
            numPages={maxPage}
            currentPage={currentPage}
            onChangePage={(page: number) => setCurrentPage(page)}
          />
        </Box>
      </HStack>
    </>
  )
}

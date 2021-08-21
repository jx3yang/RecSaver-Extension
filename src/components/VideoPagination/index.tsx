import { Content, VideoListStyle } from '@/lib/types'
import { VideoList } from '@/components/VideoList'
import { useState } from 'react'
import { Box, Center, HStack, Spinner } from '@chakra-ui/react'
import { Pagination } from '../Pagination'

type Props = {
  contents?: Content[]
  listStyle: VideoListStyle
}

export const VideoPagination: React.FC<Props> = ({ contents, listStyle }) => {
  if (!contents)
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
  const itemsPerPage = 40
  const maxPage = Math.ceil(contents.length / itemsPerPage)
  
  const paginatedContents = new Array(maxPage).fill(null).map((_, index) => contents.slice(index * itemsPerPage, (index + 1) * itemsPerPage))

  return (
    <>
      <Box pb={50}>
        <VideoList contents={paginatedContents[currentPage-1] || []} listStyle={listStyle} />
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

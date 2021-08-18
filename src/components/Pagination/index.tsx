import { Box, BoxProps, HStack } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

type PaginationBoxProps = {
  onClick: () => void
  isSelected: boolean
  isDisabled: boolean
}

const PaginationBox: React.FC<PaginationBoxProps> = ({ onClick, isSelected, isDisabled, children }) => {
  const normalProps: BoxProps = {
    cursor: 'pointer',
    borderColor: 'gray.300',
    _hover: {
      borderColor: 'blue.400',
      textColor: 'blue.300',
    },
  }

  const selectedProps: BoxProps = {
    cursor: 'pointer',
    borderColor: 'blue.400',
    textColor: 'blue.400',
  }

  const disabledProps: BoxProps = {
    cursor: 'not-allowed',
    borderColor: 'gray.300',
    textColor: 'gray.300',
  }

  return (
    <Box
      as='button'
      disabled={isDisabled}
      onClick={onClick}
      border='1px'
      h='32px'
      w='32px'
      {...(!isSelected && !isDisabled ? normalProps : {})}
      {...(isSelected ? selectedProps : {})}
      {...(isDisabled ? disabledProps : {})}
    >
      {children}
    </Box>
  )
}

type Props = {
  numPages: number
  onChangePage: (page: number) => void
  currentPage: number
}

export const Pagination: React.FC<Props> = ({ numPages, onChangePage, currentPage }) => (
  <HStack>
    <PaginationBox
      onClick={() => currentPage > 1 && onChangePage(currentPage - 1)}
      isSelected={false}
      isDisabled={currentPage === 1 || numPages === 0}
    >
      <ChevronLeftIcon />
    </PaginationBox>
    {numPages > 0 ? (
      new Array(numPages).fill(0).map((_, index) => (
        <PaginationBox
          onClick={() => onChangePage(index+1)}
          isSelected={currentPage === index+1}
          isDisabled={false}
        >
          {index+1}
        </PaginationBox>
      ))
    ) : (
      <PaginationBox
        onClick={() => {}}
        isSelected={true}
        isDisabled={false}
      >
        1
      </PaginationBox>
    )}
    <PaginationBox
      onClick={() => currentPage < numPages && onChangePage(currentPage + 1)}
      isSelected={false}
      isDisabled={currentPage === numPages || numPages === 0}
    >
      <ChevronRightIcon />
    </PaginationBox>
  </HStack>
)

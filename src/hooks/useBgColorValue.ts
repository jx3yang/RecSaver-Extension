import { useColorModeValue } from '@chakra-ui/color-mode'

export function useBgColorValue() {
  const color = useColorModeValue('white', 'gray.800')
  return color
}

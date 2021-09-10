import { useColorModeValue } from '@chakra-ui/color-mode'

export function useHoverBorderColor() {
  const normalColor = useColorModeValue('white', 'black')
  const colorOnHover = useColorModeValue('black', 'white')
  return { normalColor, colorOnHover }
}

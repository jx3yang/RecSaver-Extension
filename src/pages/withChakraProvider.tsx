import { theme } from '@/lib/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

export const withChakraProvider = (Component: React.FC) => (
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <Component />
    </ChakraProvider>
  </>
)

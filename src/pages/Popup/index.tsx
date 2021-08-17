import { render } from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { OptionsButton } from '@/components/OptionsButton'
import { AppBody } from '@/components/AppBody'

const Popup: React.FC = () => (
  <ChakraProvider>
    <OptionsButton />
    <AppBody />
  </ChakraProvider>
)

render(<Popup />, document.getElementById('popup'))

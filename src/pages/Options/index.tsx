import { render } from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

const Options: React.FC = () => (
  <ChakraProvider>
    <div>
      Sample Options page
    </div>
  </ChakraProvider>
)

render(<Options />, document.getElementById('options'))

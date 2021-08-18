import { render } from 'react-dom'
import { ChakraProvider, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useChromeStorage } from '@/hooks/useChromeStorage'
import { CONTENTS_KEY } from '@/lib/constants'
import { CacheModel, VideoListStyle } from '@/lib/types'
import { VideoPagination } from '@/components/VideoPagination'

const Popup: React.FC = () => {
  const { value: recommendationHistory } = useChromeStorage<CacheModel>(CONTENTS_KEY)

  return (
    <ChakraProvider>
      <Tabs isFitted>
        <TabList m='1em' mt='0' position='sticky' top='0' left='0' zIndex='20' bgColor='white'>
          <Tab pt='1em'>Home</Tab>
          <Tab pt='1em'>Sidebar</Tab>
          <Tab pt='1em'>Endscreen</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VideoPagination
              history={recommendationHistory?.rootRecommendations}
              listStyle={VideoListStyle.POPUP}
            />
          </TabPanel>
          <TabPanel>
            <VideoPagination
              history={recommendationHistory?.sideBarRecommendations}
              listStyle={VideoListStyle.POPUP}
            />
          </TabPanel>
          <TabPanel>
            <VideoPagination
              history={recommendationHistory?.endScreenRecommendations}
              listStyle={VideoListStyle.POPUP}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  )
}

render(<Popup />, document.getElementById('popup'))

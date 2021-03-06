import { render } from 'react-dom'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useChromeStorage } from '@/hooks/useChromeStorage'
import { useBgColorValue } from '@/hooks/useBgColorValue'
import { CONTENTS_KEY } from '@/lib/constants'
import { VersionedData, VideoListStyle } from '@/lib/types'
import { VideoPagination } from '@/components/VideoPagination'
import { withChakraProvider } from '@/pages/withChakraProvider'

const Popup: React.FC = () => {
  const { value: versionedData } = useChromeStorage<VersionedData>(CONTENTS_KEY)
  const { data: recommendationHistory } = versionedData || { data: undefined }
  const bgColor = useBgColorValue()

  return (
    <Tabs isFitted>
      <TabList m='1em' mt='0' position='sticky' top='0' left='0' zIndex='20' bgColor={bgColor}>
        <Tab pt='1em'>Home</Tab>
        <Tab pt='1em'>Sidebar</Tab>
        <Tab pt='1em'>Endscreen</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VideoPagination
            contents={recommendationHistory?.rootRecommendations}
            listStyle={VideoListStyle.POPUP}
          />
        </TabPanel>
        <TabPanel>
          <VideoPagination
            contents={recommendationHistory?.sideBarRecommendations}
            listStyle={VideoListStyle.POPUP}
          />
        </TabPanel>
        <TabPanel>
          <VideoPagination
            contents={recommendationHistory?.endScreenRecommendations}
            listStyle={VideoListStyle.POPUP}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

render(withChakraProvider(Popup), document.getElementById('popup'))

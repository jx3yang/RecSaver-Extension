import { useChromeStorage } from '@/hooks/useChromeStorage'
import { CONTENTS_KEY } from '@/lib/constants'
import { CacheModel, VideoListStyle } from '@/lib/types'
import { VideoList } from '@/components/VideoList'

export const AppBody = () => {
  const { value: recommendationHistory } = useChromeStorage<CacheModel>(CONTENTS_KEY)

  return (
    recommendationHistory ? (
      <VideoList contents={recommendationHistory.rootRecommendations[0].contents || []} listStyle={VideoListStyle.POPUP} />
    ) : (
      <>loading</>
    )
  )
}

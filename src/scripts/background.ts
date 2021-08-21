import { CONTENTS_KEY } from '@/lib/constants'
import { VersionedData, ContentType, Message, MessageType, Request, RequestType, AbstractVersionedData } from '@/lib/types'
import { runMigrations } from './migrations'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([CONTENTS_KEY], (store) => {
    const versionedData = store[CONTENTS_KEY] as AbstractVersionedData | undefined
    const arg = !versionedData || !versionedData.data || !versionedData.metadata.version
      ? undefined
      : versionedData
    runMigrations(arg).then((data) => chrome.storage.local.set({ [CONTENTS_KEY]: data }))
  })
})

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  const { tabId, url, transitionQualifiers } = details
  if (/^https\:\/\/www\.youtube\.com\/*/.test(url)) {
    const message: Message = {
      type: MessageType.HISTORY_CHANGE,
      forwardBack: transitionQualifiers.includes('forward_back'),
    }
    chrome.tabs.sendMessage(tabId, message)
  }
})

chrome.runtime.onMessage.addListener((request: Request, sender) => {
  const { type: requestType } = request
  const { tab } = sender
  if (!tab || !tab.id) return
  switch (requestType) {
    case RequestType.CONTENTS: {
      // use a LRU caching strategy
      // @ts-ignore
      const { contentType } = request
      const { data } = request
      if (data.length === 0) return
      chrome.storage.local.get([CONTENTS_KEY], (store) => {
        const versionedData: VersionedData = store[CONTENTS_KEY]
        const { data: cache } = versionedData
        const key = (() => {
          switch (contentType) {
            case ContentType.ROOT:
              return 'rootRecommendations'
            case ContentType.SIDEBAR:
              return 'sideBarRecommendations'
            case ContentType.ENDSCREEN:
              return 'endScreenRecommendations'
            default:
              return ''
          }
        })()
        if (!key) return
        const { size } = cache
        const contentsSet = new Set<string>()
        // @ts-ignore
        const contents = data.filter(({ videoUrl }) => {
          if (!contentsSet.has(videoUrl)) {
            contentsSet.add(videoUrl)
            return true
          }
          return false
        })
        const history = cache[key]
        const newHistory = [...contents, ...history.filter(({ videoUrl }) => !contentsSet.has(videoUrl))].slice(0, size)
        chrome.storage.local.set({
          [CONTENTS_KEY]: {
            ...versionedData,
            data: {
              ...cache,
              [key]: newHistory,
            },
          }
        })
      })
      break
    }
    case RequestType.ERROR: {
      console.error(request.data)
      break
    }
    default: break
  }
})

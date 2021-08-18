import { CACHE_SIZE, CONTENTS_KEY } from '@/lib/constants'
import { CacheModel, Content, ContentType, Message, MessageType, RecommendationsEntry, Request, RequestType } from '@/lib/types'
import { addElementToFront, isSubset, moveElementToFront, removeLastElement } from '@/lib/utils'

chrome.runtime.onInstalled.addListener(() => {
  const initialCache: CacheModel = {
    size: CACHE_SIZE,
    rootRecommendations: [],
    sideBarRecommendations: [],
    endScreenRecommendations: [],
  }
  chrome.storage.local.get([CONTENTS_KEY], (store) => {
    if (!store[CONTENTS_KEY])
      chrome.storage.local.set({ [CONTENTS_KEY]: initialCache })
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
  const { id: currentTabId } = tab
  switch (requestType) {
    case RequestType.CONTENTS: {
      // use a LRU caching strategy
      // @ts-ignore
      const { id: requestId, contentType } = request
      const { data } = request
      if (data.length === 0) return
      chrome.storage.local.get([CONTENTS_KEY], (store) => {
        const cache: CacheModel = store[CONTENTS_KEY]
        const { size } = cache
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
        const history = cache[key]
        const idx = history.findIndex(({ listenerId, tabId }) => listenerId === requestId && tabId === currentTabId)
        if (idx !== -1 && isSubset(history[idx].contents, data, (content: Content) => content.videoUrl)) {
          const newHistory = moveElementToFront(history, idx)
          newHistory[0].contents = data
          chrome.storage.local.set({
            [CONTENTS_KEY]: {
              ...cache,
              [key]: newHistory,
            },
          })
        } else {
          const newEntry: RecommendationsEntry = { listenerId: requestId, contents: data, tabId: currentTabId }
          const newHistory = addElementToFront(history, newEntry)
          chrome.storage.local.set({
            [CONTENTS_KEY]: {
              ...cache,
              [key]: newHistory.length <= size ? newHistory : removeLastElement(newHistory),
            },
          })
        }
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

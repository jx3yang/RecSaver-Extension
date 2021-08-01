import { CACHE_SIZE, CONTENTS_KEY } from '../constants'
import { CacheModel, Content, ContentType, Request, RequestType } from '../types'
import { addElementToFront, moveElementToFront, removeLastElement } from '../utils'

chrome.runtime.onInstalled.addListener(() => {
  const initialCache: CacheModel = {
    size: CACHE_SIZE,
    rootRecommendations: [],
    sideBarRecommendations: [],
    endScreenRecommendations: [],
  }
  chrome.storage.local.set({ [CONTENTS_KEY]: initialCache })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    let script: string | null = null
    if (tab.url === 'https://www.youtube.com/') {
      script = './sendContentsFromRoot.js'
    } else if (/^https\:\/\/www\.youtube\.com\/watch*/.test(tab.url || '')) {
      script = './sendContentsFromWatch.js'
    }

    if (script)
      chrome.scripting.executeScript({
        target: { tabId },
        files: [script],
      })
        .catch((e) => console.error(e))
  }
})

chrome.runtime.onMessage.addListener((request: Request, sender) => {
  const { type: requestType } = request
  switch (requestType) {
    case RequestType.CONTENTS: {
      // use a LRU caching strategy
      // @ts-ignore
      const { id: requestId, contentType } = request
      const { data } = request
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
        const idx = history.findIndex(({ id }) => id === requestId)
        if (idx === -1) {
          const newHistory = addElementToFront(history, { id: requestId, contents: data })
          chrome.storage.local.set({
            [CONTENTS_KEY]: {
              ...cache,
              [key]: newHistory.length <= size ? newHistory : removeLastElement(newHistory),
            },
          })
        } else {
          const newHistory = moveElementToFront(history, idx)
          const oldContents = newHistory[0].contents as Content[]
          newHistory[0].contents = data.length >= oldContents.length ? data : oldContents
          chrome.storage.local.set({
            [CONTENTS_KEY]: {
              ...cache,
              [key]: newHistory,
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

import { CACHE_SIZE, CONTENTS_KEY } from '../constants'
import { CacheModel, Request, RequestType } from '../types'
import { addElementToFront, moveElementToFront, removeLastElement } from '../utils'

chrome.runtime.onInstalled.addListener(() => {
  const initialCache: CacheModel = {
    size: CACHE_SIZE,
    history: [],
  }
  chrome.storage.local.set({ [CONTENTS_KEY]: initialCache })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url === 'https://www.youtube.com/') {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['./saveRecommendations.js'],
    })
      .catch((e) => console.error(e))
  }
})

chrome.runtime.onMessage.addListener((request: Request, sender) => {
  // use a LRU caching strategy
  const { id: requestId } = request
  if (request.type === RequestType.CONTENTS) {
    const { data } = request
    chrome.storage.local.get([CONTENTS_KEY], (store) => {
      const { size, history }: CacheModel = store[CONTENTS_KEY]
      const idx = history.findIndex(({ id }) => id === requestId)
      if (idx === -1) {
        const newHistory = addElementToFront(history, { id: requestId, contents: data })
        chrome.storage.local.set({
          [CONTENTS_KEY]: {
            size,
            history: newHistory.length <= size ? newHistory : removeLastElement(newHistory),
          },
        })
      } else {
        const newHistory = moveElementToFront(history, idx)
        newHistory[0].contents = data
        chrome.storage.local.set({
          [CONTENTS_KEY]: {
            size,
            history: newHistory,
          },
        })
      }
    })
  }
})

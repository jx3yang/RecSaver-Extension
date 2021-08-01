import { Content, RequestType, Request, ContentType } from './types'

export const setUpObserversWithSender = (sendContents: () => void, parentNode: Element | null | undefined) => {
  // observe for dom changes
  const observer = new MutationObserver(() => {
    sendContents()
  })

  if (parentNode)
    observer.observe(parentNode, { childList: true, subtree: true, attributes: true })
  
  // observe for tab focus change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible')
      sendContents()
  })  
}

export const setUpObservers = (parseContents: () => Content[], parentNode: Element | null | undefined, contentType: ContentType) => {
  const id = Math.random().toString()
  const getRequest = (): Request => ({ type: RequestType.CONTENTS, data: parseContents(), id, contentType })
  const sendContents = () => {
    chrome.runtime.sendMessage(getRequest())
  }
  setUpObserversWithSender(sendContents, parentNode)
}

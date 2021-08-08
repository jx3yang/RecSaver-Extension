import { Content, RequestType, Request, ContentType } from './types'

export const setUpObserversWithSender = (
  sendContents: () => void,
  parentNode: Element | null | undefined,
  enabled: boolean,
  urlPattern?: RegExp,
) => {

  let observersEnabled = enabled
  const send = () => {
    if (observersEnabled && (!urlPattern || urlPattern.test(window.location.href)))
      sendContents()
  }
  // observe for dom changes
  const observer = new MutationObserver(() => {
    send()
  })

  if (parentNode)
    observer.observe(parentNode, { childList: true, subtree: true, attributes: true })
  // observe for tab focus change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible')
      send()
  })

  return {
    disable: () => { observersEnabled = false },
    enable: () => { observersEnabled = true },
  }
}

export const setUpObservers = (
  parseContents: () => Content[],
  parentNode: Element | null | undefined,
  contentType: ContentType,
  enabled: boolean,
  urlPattern?: RegExp,
) => {
  let enableSend = enabled
  const id = Math.random().toString()
  const getRequest = (): Request => ({ type: RequestType.CONTENTS, data: parseContents(), id, contentType })
  const sendContents = () => {
    chrome.runtime.sendMessage(getRequest())
  }

  const send = () => {
    if (enableSend && (!urlPattern || urlPattern.test(window.location.href)))
      sendContents()
  }
  // observe for dom changes
  const observer = new MutationObserver(() => {
    send()
  })

  if (parentNode)
    observer.observe(parentNode, { childList: true, subtree: true, attributes: true })
  // observe for tab focus change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible')
      send()
  })

  return {
    disableSend: () => { enableSend = false },
    enableSend: () => { enableSend = true },
  }
}

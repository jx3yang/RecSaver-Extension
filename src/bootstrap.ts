import { setUpObservers } from './observe'
import { Content, ContentType } from './types'

export const startObservers = (
  getContentsNode: () => Element | null | undefined,
  contentSelectors: string[],
  getParser: (contentsNode: Element | null | undefined, contentSelectors: string[], f?: (content: Content) => boolean) => () => Content[],
  contentType: ContentType,
  enabled: boolean = false,
  urlPattern?: RegExp,
  intervalMs: number = 1000,
) => {
  let observersEnabled = enabled
  let disableSend = () => {}

  const waitForNode = () => new Promise<Element>((resolve) => {
    const contentsNode = getContentsNode()
    if (contentsNode) resolve(contentsNode)
    const intervalId = setInterval(() => {
      const contentsNode = getContentsNode()
      if (contentsNode) {
        clearInterval(intervalId)
        resolve(contentsNode)
      }
    }, intervalMs)
  })

  const setUp = (contentsNode: Element) => {
    const parser = getParser(contentsNode, contentSelectors)
    const { disableSend: _disableSend } = setUpObservers(parser, contentsNode, contentType, observersEnabled, urlPattern)
    disableSend = _disableSend
  }

  const enableObservers = () => {
    observersEnabled = true
    waitForNode().then(setUp)
  }

  const disableObservers = () => {
    observersEnabled = false
    disableSend()
  }

  if (observersEnabled) {
    enableObservers()
  }

  return { enableObservers, disableObservers }
}

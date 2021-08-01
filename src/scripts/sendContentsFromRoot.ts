import { Content, RequestType, Request } from '../types'

const parseContent = (content: Element): Content | null => {
  const thumbnail = content.querySelector('#thumbnail') as any
  if (!thumbnail) return null
  const videoUrl = thumbnail.href
  const thumbnailUrl = thumbnail.querySelector('#img').src
  const videoTitle = (content.querySelector('#video-title') as any).textContent
  return {
    videoUrl,
    thumbnailUrl,
    videoTitle,
  }
}

const getContents = () => {
  const contentsNode = document.getElementById('primary')?.querySelector('#contents')
  const trySelector = (selector: string): Element[] => [...(contentsNode?.querySelectorAll(selector) || [])]

  const selectors = [
    '#content',
    'ytd-grid-video-renderer',
  ]

  return selectors.reduce((acc, selector) => acc.length > 0 ? acc : trySelector(selector), [] as Element[])
}

const parseContents = (): Content[] =>
  getContents()
    .map(parseContent)
    .filter((content) => content && content.thumbnailUrl) as Content[]

const id = Math.random().toString()

const observer = new MutationObserver((m) => {
  chrome.runtime.sendMessage({ type: RequestType.CONTENTS, data: parseContents(), id } as Request)
})

const contents = document.getElementById('primary')?.querySelector('#contents')
if (contents)
  observer.observe(contents, { childList: true, subtree: true, attributes: true })

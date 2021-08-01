import { Content, RequestType, Request } from '../types'

const id = Math.random().toString()

const parseContent = (content: Element): Content | null => {
  try {
    const thumbnail = content.querySelector('#thumbnail') as any
    if (!thumbnail) return null
    const metadata = content.querySelector('#metadata')
    const metadataLine = metadata?.querySelector('#metadata-line')

    const videoUrl = thumbnail.href
    const thumbnailUrl = thumbnail.querySelector('#img').src
    const videoTime = thumbnail.querySelector('ytd-thumbnail-overlay-time-status-renderer').innerText
    const videoTitle = (content.querySelector('#video-title') as any).innerText

    const channelIconUrl = (content.querySelector('#avatar-link #img') as any).src
    const channelNameContainer = metadata?.querySelector('#channel-name a')
    const channelName = (channelNameContainer as any).innerText
    const channelUrl = (channelNameContainer as any).href

    const [views, uploadedTime] = ((metadataLine as any).innerText as string || '\n').split('\n')

    return {
      videoUrl,
      thumbnailUrl,
      videoTime,
      videoTitle,
      channelIconUrl,
      channelName,
      channelUrl,
      views,
      uploadedTime,
    }
  } catch (e) {
    return null
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
    .filter((content) => content && content.thumbnailUrl && content.channelIconUrl) as Content[]

const sendContents = () => chrome.runtime.sendMessage({ type: RequestType.CONTENTS, data: parseContents(), id } as Request)

// observe for dom changes
const observer = new MutationObserver(() => {
  sendContents()
})

const contents = document.getElementById('primary')?.querySelector('#contents')
if (contents)
  observer.observe(contents, { childList: true, subtree: true, attributes: true })

// observe for tab focus change
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible')
    sendContents()
})

import { Content } from './types'

function baseGetAttribute<T>(element: Element | null | undefined, attr: string, def: T): T {
  return element ? (element as any)[attr] || def : def
}

const getAttribute = (element: Element | null | undefined, attr: string, def: string = '') => baseGetAttribute(element, attr, def)

const parseContent = (content: Element): Content | null => {
  try {
    // TODO: put into configurable selectors

    const thumbnail = content.querySelector('#thumbnail')
    if (!thumbnail) return null
    const metadata = content.querySelector('#metadata')
    const metadataLine = metadata?.querySelector('#metadata-line')

    const videoUrl = getAttribute(thumbnail, 'href')
    const thumbnailUrl = getAttribute(thumbnail.querySelector('#img'), 'src')
    const videoTime = getAttribute(thumbnail.querySelector('ytd-thumbnail-overlay-time-status-renderer'), 'innerText')
    const videoTitle = getAttribute(content.querySelector('#video-title'), 'innerText')

    const channelIconUrl = getAttribute(content.querySelector('#avatar-link #img'), 'src')
    const channelNameContainer = metadata?.querySelector('#channel-name')
    const channelName = getAttribute(channelNameContainer, 'innerText')
    const channelUrl = getAttribute(channelNameContainer?.querySelector('a'), 'href')

    const [views, uploadedTime] = getAttribute(metadataLine, 'innerText', '\n').split('\n')
    const isLive = !!content.querySelector('.badge-style-type-live-now')

    return {
      videoUrl,
      thumbnailUrl,
      videoTime,
      videoTitle,
      channelIconUrl,
      channelName,
      channelUrl,
      views,
      uploadedTime: isLive ? 'LIVE' : uploadedTime || '',
    }
  } catch (e) {
    return null
  }
}

const parseEndScreenContent = (content: Element): Content | null => {
  try {
    const thumbnailUrl = baseGetAttribute(content.querySelector('.ytp-videowall-still-image'), 'style', { 'background-image': '' })['background-image'].slice(5, -2)
    const videoUrl = getAttribute(content, 'href')
    const videoTitle = getAttribute(content.querySelector('.ytp-videowall-still-info-title'), 'innerText')
    const [channelName, views] = getAttribute(content.querySelector('.ytp-videowall-still-info-author'), 'innerText').split(' • ')
    const videoTime = getAttribute(content.querySelector('.ytp-videowall-still-info-duration'), 'innerText')
    const isLive = !videoTime

    return {
      thumbnailUrl,
      videoTime,
      videoUrl,
      videoTitle,
      channelUrl: '',
      channelName,
      views,
      uploadedTime: isLive ? 'LIVE' : '',
      channelIconUrl: '',
    }
  } catch (e) {
    return null
  }
}

const defaultFilter = ({ thumbnailUrl, videoUrl }: Content) => !!thumbnailUrl && !!videoUrl

const baseParseContents = (getContentNodes: () => Element[], parse: (element: Element) => Content | null, f: (content: Content) => boolean): Content[] =>
  getContentNodes()
    .map(parse)
    .filter((content) => content && f(content)) as Content[]

const parseContents = (getContentNodes: () => Element[], f: (content: Content) => boolean): Content[] =>
  baseParseContents(getContentNodes, parseContent, f)

const parseEndScreenContents = (getContentNodes: () => Element[], f: (content: Content) => boolean): Content[] =>
  baseParseContents(getContentNodes, parseEndScreenContent, f)

const getContentsParserWithGetter = (
  getContentNodes: () => Element[],
  parse: (getContentNodes: () => Element[], f: (content: Content) => boolean) => Content[],
  f: (content: Content) => boolean = defaultFilter,
) => () => parse(getContentNodes, f)

const buildContentNodesGetter = (
  contentsNode: Element | null | undefined,
  contentSelectors: string[],
) => () => {
  const trySelector = (selector: string): Element[] => [...(contentsNode?.querySelectorAll(selector) || [])]
  return contentSelectors.reduce((acc, selector) => acc.length > 0 ? acc : trySelector(selector), [] as Element[])
}

export const getContentsParser = (
  contentsNode: Element | null | undefined,
  contentSelectors: string[],
  f: (content: Content) => boolean = defaultFilter,
) => (
  getContentsParserWithGetter(buildContentNodesGetter(contentsNode, contentSelectors), parseContents, f)
)

export const getEndScreenContentsParser = (
  contentsNode: Element | null | undefined,
  contentSelectors: string[],
  f: (content: Content) => boolean = defaultFilter,
) => (
  getContentsParserWithGetter(buildContentNodesGetter(contentsNode, contentSelectors), parseEndScreenContents, f)
)

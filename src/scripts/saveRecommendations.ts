import { Content, RequestType, Request } from '../types'

const parseContent = (content: HTMLElement): Content | null => {
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

const parseContents = (): Content[] =>
  ([...document.getElementById('primary')?.querySelector('#contents')?.querySelectorAll('#content') || []] as HTMLElement[])
    .map(parseContent)
    .filter((content) => content && content.thumbnailUrl) as Content[]

const id = Math.random().toString()

const observer = new MutationObserver((m) => {
  chrome.runtime.sendMessage({ type: RequestType.CONTENTS, data: parseContents(), id } as Request)
})

const contents = document.getElementById('primary')?.querySelector('#contents')
if (contents)
  observer.observe(contents, { childList: true, subtree: true, attributes: true })

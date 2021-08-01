import { setUpObservers } from '../observe'
import { getContentsParser, getEndScreenContentsParser } from '../parsers'
import { ContentType } from '../types'

const contentsNode = document.getElementById('secondary')?.querySelector('#contents')
const selectors = [
  '#content',
  'ytd-compact-video-renderer',
]
const endScreenContentsNode = document.querySelector('.ytp-endscreen-content')
const endScreenSelectors = [
  'a',
]
const parseContents = getContentsParser(contentsNode, selectors)
const parseEndScreenContents = getEndScreenContentsParser(endScreenContentsNode, endScreenSelectors)
setUpObservers(parseContents, contentsNode, ContentType.SIDEBAR)
setUpObservers(parseEndScreenContents, endScreenContentsNode, ContentType.ENDSCREEN)

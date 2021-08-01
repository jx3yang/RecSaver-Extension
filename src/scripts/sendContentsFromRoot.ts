import { setUpObservers } from '../observe'
import { getContentsParser } from '../parsers'
import { ContentType } from '../types'

const contentsNode = document.getElementById('primary')?.querySelector('#contents')
const selectors = [
  '#content',
  'ytd-grid-video-renderer',
]
const parseContents = getContentsParser(contentsNode, selectors)
setUpObservers(parseContents, contentsNode, ContentType.ROOT)

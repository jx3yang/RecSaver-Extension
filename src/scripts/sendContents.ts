import { startObservers } from '@/lib/bootstrap'
import { getContentsParser, getEndScreenContentsParser } from '@/lib/parsers'
import { ContentType, Message, MessageType } from '@/lib/types'

const getRootContentsNode = () => document.querySelector('#primary #contents')
const getSidebarContentsNode = () => document.querySelector('#secondary #related #contents') || document.querySelector('#primary #related #contents')
const getEndScreenContentsNode = () => document.querySelector('.ytp-endscreen-content')

const rootContentsSelectors = [
  '#content',
  'ytd-grid-video-renderer',
]

const sidebarContentsSelector = [
  '#content',
  'ytd-compact-video-renderer',
]
const endScreenContentsSelector = [
  'a',
]

const rootUrlPattern = /^https\:\/\/www\.youtube\.com\/$/
const watchUrlPattern = /^https\:\/\/www\.youtube\.com\/watch*/

let historyLength = history.length
let currentUrl = window.location.href

const {
  enableObservers: enableRootObservers,
  disableObservers: disableRootObservers,
} = startObservers(
  getRootContentsNode,
  rootContentsSelectors,
  getContentsParser,
  ContentType.ROOT,
  rootUrlPattern.test(currentUrl),
  rootUrlPattern,
)


const {
  enableObservers: enableSidebarObservers,
  disableObservers: disableSidebarObservers,
} = startObservers(
  getSidebarContentsNode,
  sidebarContentsSelector,
  getContentsParser,
  ContentType.SIDEBAR,
  watchUrlPattern.test(currentUrl),
  watchUrlPattern,
)

const {
  enableObservers: enableEndScreenObservers,
  disableObservers: disableEndScreenObservers,
} = startObservers(
  getEndScreenContentsNode,
  endScreenContentsSelector,
  getEndScreenContentsParser,
  ContentType.ENDSCREEN,
  watchUrlPattern.test(currentUrl),
  watchUrlPattern,
)

chrome.runtime.onMessage.addListener((request: Message) => {
  const { type: requestType, forwardBack } = request
  if ((requestType === MessageType.HISTORY_CHANGE && history.length !== historyLength) || forwardBack) {
    historyLength = history.length
    currentUrl = window.location.href

    if (rootUrlPattern.test(currentUrl)) {
      disableSidebarObservers()
      disableEndScreenObservers()
      enableRootObservers()
    } else if (watchUrlPattern.test(currentUrl)) {
      disableRootObservers()
      enableSidebarObservers()
      enableEndScreenObservers()
    } else {
      disableRootObservers()
      disableSidebarObservers()
      disableEndScreenObservers()
    }
  }
})

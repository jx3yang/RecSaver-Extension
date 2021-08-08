import { startObservers } from '../bootstrap'
import { getContentsParser, getEndScreenContentsParser } from '../parsers'
import { ContentType, Message, MessageType } from '../types'

// const start = async () => {
//   const getSidebarContentsNode = () => document.querySelector('#secondary #contents')
//   // const getEndScreenContentsNode = () => document.querySelector('.ytp-endscreen-content')

//   const sidebarContentsSelector = [
//     '#content',
//     'ytd-compact-video-renderer',
//   ]
//   // const endScreenContentsSelector = [
//   //   'a',
//   // ]

//   const sidebarObservers = await startObservers(
//     getSidebarContentsNode,
//     sidebarContentsSelector,
//     getContentsParser,
//     ContentType.SIDEBAR,
//     false,
//   )

//   // startObservers(
//   //   getEndScreenContentsNode,
//   //   endScreenContentsSelector,
//   //   getEndScreenContentsParser,
//   //   ContentType.ENDSCREEN,
//   // )

//   // window.addEventListener('popstate', (event) => {
//   //   console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
//   // });
//   // chrome.webNavigation.onHistoryStateUpdated.addListener(() => { console.log('history updated bitch') })
//   // const id = Math.random().toString()
//   // setInterval(() => console.log(id), 5000)

//   let { length: historyLength } = history
//   let url = window.location.href

//   const manageObservers = () => {
//     if (url === 'https://www.youtube.com/') {
//       sidebarObservers.disable()
//     } else if (/^https\:\/\/www\.youtube\.com\/watch*/.test(url)) {
//       sidebarObservers.enable()
//     }
//   }

//   console.log('hello')

//   chrome.runtime.onMessage.addListener((message: Message) => {
//     const { type } = message
//     switch (type) {
//       case MessageType.HISTORY_CHANGE: {
//         const { length: currentLength } = history
//         const currentUrl = window.location.href
//         const { forwardBack } = message
//         if (forwardBack) {
//           url = currentUrl
//           manageObservers()
//         } else if (currentLength !== historyLength || currentUrl !== url) {
//           url = currentUrl
//           historyLength = currentLength
//           manageObservers()
//         }
//         return
//       }
//       default: return
//     }
//   })
// }

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
  if (request.type === MessageType.HISTORY_CHANGE && history.length !== historyLength) {
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

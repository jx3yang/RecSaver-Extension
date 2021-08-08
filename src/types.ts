export type Content = {
  videoUrl: string
  thumbnailUrl: string
  videoTime: string
  videoTitle: string
  channelIconUrl: string
  channelName: string
  channelUrl: string
  views: string
  uploadedTime: string
}

export enum RequestType {
  CONTENTS = 'CONTENTS',
  ERROR = 'ERROR',
}

export enum MessageType {
  HISTORY_CHANGE = 'HISTORY_CHANGE',
}

export enum ContentType {
  ROOT = 'ROOT',
  SIDEBAR = 'SIDEBAR',
  ENDSCREEN = 'ENDSCREEN',
}

export type Request =
  | { id: string, type: RequestType.CONTENTS, contentType: ContentType, data: Content[] }
  | { id: string, type: RequestType.ERROR, data: any }

export type Message =
  | { type: MessageType.HISTORY_CHANGE, forwardBack: boolean }

export type RecommendationsEntry = {
  listenerId: string
  tabId: number
  contents: Content[]
}

export type CacheModel = {
  size: number
  rootRecommendations: RecommendationsEntry[]
  sideBarRecommendations: RecommendationsEntry[]
  endScreenRecommendations: RecommendationsEntry[]
}

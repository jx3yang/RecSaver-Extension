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

export enum ContentType {
  ROOT = 'ROOT',
  SIDEBAR = 'SIDEBAR',
  ENDSCREEN = 'ENDSCREEN',
}

export type Request =
  | { id: string, type: RequestType.CONTENTS, contentType: ContentType, data: Content[] }
  | { id: string, type: RequestType.ERROR, data: any }

type RecommendationsEntry = {
  id: string
  contents: Content[]
}

export type CacheModel = {
  size: number
  rootRecommendations: RecommendationsEntry[]
  sideBarRecommendations: RecommendationsEntry[]
  endScreenRecommendations: RecommendationsEntry[]
}

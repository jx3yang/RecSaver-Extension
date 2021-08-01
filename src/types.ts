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

export type Request =
  | { id: string, type: RequestType.CONTENTS, data: Content[] }
  | { id: string, type: RequestType.ERROR, data: any }

export type CacheModel = {
  size: number
  history: { id: string, contents: Content[] }[]
}

export type Content = {
  videoUrl: string
  thumbnailUrl: string
  videoTitle: string
}

export enum RequestType {
  CONTENTS = 'CONTENTS',
}

export type Request =
  | { id: string, type: RequestType.CONTENTS, data: Content[] }

export type CacheModel = {
  size: number
  history: { id: string, contents: Content[] }[]
}

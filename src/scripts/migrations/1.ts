/*

Migration Version: 1

Description:

*/

import { AbstractVersionedData } from '@/lib/types'
import { cloneDeep } from 'lodash'

const version = 1

export default {
  version,
  migrate: async (oldVersionedData: AbstractVersionedData): Promise<AbstractVersionedData> => {
    const versionedData = cloneDeep(oldVersionedData)

    return {
      ...versionedData,
      metadata: {
        version,
      },
      data: {
        size: 200,
        rootRecommendations: [],
        sideBarRecommendations: [],
        endScreenRecommendations: [],
      }
    }
  },
}

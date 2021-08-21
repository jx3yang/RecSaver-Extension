MIGRATIONS_FOLDER=./src/scripts/migrations

current_version=$(
  ls -1 ${MIGRATIONS_FOLDER} \
  | egrep '^\d+\.ts$' \
  | sort -n \
  | tail -n 1 \
  | cut -d'.' -f 1
)

new_version=$((current_version + 1))

cat > "${MIGRATIONS_FOLDER}/${new_version}.ts" << EOF
/*

Migration Version: ${new_version}

Description:

*/

import { AbstractVersionedData } from '@/lib/types'
import { cloneDeep } from 'lodash'

const version = ${new_version}

export default {
  version,
  migrate: async (oldVersionedData: AbstractVersionedData): Promise<AbstractVersionedData> => {
    const versionedData = cloneDeep(oldVersionedData)

    return versionedData
  },
}
EOF

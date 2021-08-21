import { AbstractVersionedData } from '@/lib/types'
import m1 from './1'

type Migration = {
  version: number
  migrate: (old: AbstractVersionedData) => Promise<AbstractVersionedData>
}

const migrations: Migration[] = [
  m1,
]

const defaultVersionedData: AbstractVersionedData = {
  metadata: {
    version: 0,
  },
  data: {},
}

export const runMigrations = async (
  versionedData: AbstractVersionedData = defaultVersionedData,
) => {
  const isPendingMigration = (m: Migration) => m.version > versionedData.metadata.version
  const pendingMigrations = migrations.filter(isPendingMigration).sort((a, b) => a.version - b.version)
  for (const migration of pendingMigrations) {
    try {
      versionedData = await migration.migrate(versionedData)
    } catch (e) {
      console.error(e)
      return versionedData
    }
  }
  return versionedData
}

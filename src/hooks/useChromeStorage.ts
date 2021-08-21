import { useEffect, useState } from 'react'

type StorageGetter = (store: { [key: string]: string }) => any

export function useChromeStorage<T>(key: string, storageGetter?: StorageGetter) {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    chrome.storage.local.get([key], (store) => {
      if (storageGetter)
        setValue(storageGetter(store) as T)
      else
        setValue(store[key] as T)
    })
  }, [])

  return { value }
}

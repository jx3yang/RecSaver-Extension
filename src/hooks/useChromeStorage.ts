import { useEffect, useState } from 'react'

export function useChromeStorage<T>(key: string) {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    chrome.storage.local.get([key], (store) => {
      setValue(store[key] as T)
    })
  }, [])

  return { value }
}

export function moveElementToFront<T>(arr: T[], idx: number) {
  return arr.length > idx ? [arr[idx], ...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr
}

export function addElementToFront<T>(arr: T[], element: T) {
  return [element, ...arr]
}

export function removeLastElement<T>(arr: T[]) {
  return arr.slice(0, -1)
}

/**
 * Returns true <==> Set(arr1.map(getKey)) is a subset of Set(arr2.map(getKey))
 */
export function isSubset<T, K>(arr1: T[], arr2: T[], getKey: (elem: T) => K) {
  const keySet = new Set(arr2.map(getKey))
  return arr1.every((e) => keySet.has(getKey(e)))
}

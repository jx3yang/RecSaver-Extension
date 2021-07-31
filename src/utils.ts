export const moveElementToFront = (arr: any[], idx: number) =>
  arr.length > idx ? [arr[idx], ...arr.slice(0, idx), ...arr.slice(idx + 1)] : arr

export const addElementToFront = (arr: any[], element: any) => [element, ...arr]

export const removeLastElement = (arr: any[]) => arr.slice(0, -1)

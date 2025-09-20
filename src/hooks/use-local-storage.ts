import * as React from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = React.useCallback((): T => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  }, [key, initialValue])

  const [stored, setStored] = React.useState<T>(read)

  React.useEffect(() => {
    setStored(read())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = React.useCallback(
    (value: React.SetStateAction<T>) => {
      setStored((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(next))
          }
        } catch {}
        return next
      })
    },
    [key],
  )

  return [stored, setValue] as const
}

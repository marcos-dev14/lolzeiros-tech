import { useState, useEffect } from 'react'

// https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
export function useDebounce(
  value: string | string[] | number | number[] | Record<string, unknown>,
  delay: number
): string | string[] | number | number[] | Record<string, unknown> {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [delay, value])

  return debouncedValue
}

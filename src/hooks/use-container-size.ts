import { useEffect, useRef, useState } from "react"

export function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        setSize({ width: cr.width, height: cr.height })
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return [ref, size] as const
}

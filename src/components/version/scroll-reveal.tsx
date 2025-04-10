import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  once?: boolean
}

export function ScrollReveal({ children, delay = 0, duration = 0.5, once = true }: ScrollRevealProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay: delay / 1000,
          ease: "easeOut",
        },
      })
      if (once) {
        setHasAnimated(true)
      }
    }
  }, [isInView, controls, delay, duration, once, hasAnimated])

  return (
    <motion.div ref={ref} initial={{ y: 20, opacity: 0 }} animate={controls} className="w-full">
      {children}
    </motion.div>
  )
}


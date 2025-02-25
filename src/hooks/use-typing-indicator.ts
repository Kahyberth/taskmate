"use client"

import { useState, useEffect } from "react"

export function useTypingIndicator() {
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>()

  const startTyping = () => {
    setIsTyping(true)

    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    const timeout = setTimeout(() => {
      setIsTyping(false)
    }, 3000)

    setTypingTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  return { isTyping, startTyping }
}


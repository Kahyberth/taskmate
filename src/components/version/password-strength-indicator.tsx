import { useEffect, useState } from "react"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setMessage("")
      return
    }

    let currentStrength = 0

    // Length check
    if (password.length >= 8) currentStrength += 1

    // Uppercase check
    if (/[A-Z]/.test(password)) currentStrength += 1

    // Lowercase check
    if (/[a-z]/.test(password)) currentStrength += 1

    // Number check
    if (/[0-9]/.test(password)) currentStrength += 1

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) currentStrength += 1

    setStrength(currentStrength)

    // Set message based on strength
    if (currentStrength <= 2) {
      setMessage("Débil")
    } else if (currentStrength <= 4) {
      setMessage("Media")
    } else {
      setMessage("Fuerte")
    }
  }, [password])

  if (!password) return null

  const getColor = () => {
    if (strength <= 2) return "bg-red-500"
    if (strength <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getTextColor = () => {
    if (strength <= 2) return "text-red-400"
    if (strength <= 4) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              i < strength ? getColor() : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${getTextColor()}`}>{message && `Seguridad: ${message}`}</p>
    </div>
  )
}


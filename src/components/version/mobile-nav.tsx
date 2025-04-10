import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface MobileNavProps {
  onSignInClick: () => void
}

export function MobileNav({ onSignInClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignInClick = () => {
    setIsOpen(false)
    onSignInClick()
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-white hover:bg-white/10">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-gradient-to-b from-[#170f3e] to-[#0e0a29] p-6 shadow-xl"
            >
              <div className="flex justify-end mb-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <nav className="space-y-6">
                <a
                  href="#features"
                  className="block text-lg font-medium text-white hover:text-violet-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="block text-lg font-medium text-white hover:text-violet-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#support"
                  className="block text-lg font-medium text-white hover:text-violet-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Support
                </a>
                <div className="pt-6 border-t border-white/10">
                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                    onClick={handleSignInClick}
                  >
                    Sign In
                  </Button>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


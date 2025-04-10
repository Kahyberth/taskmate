import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"


const testimonials = [
  {
    id: 1,
    name: "María Rodríguez",
    role: "Project Manager, TechCorp",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "TaskMate ha transformado la forma en que gestionamos nuestros proyectos. La interfaz es intuitiva y las funciones de colaboración son excepcionales. Hemos aumentado nuestra productividad en un 30% desde que empezamos a usarlo.",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "CTO, StartupX",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "Como startup en crecimiento, necesitábamos una herramienta que creciera con nosotros. TaskMate no solo cumplió con nuestras expectativas, sino que las superó. La integración con nuestras herramientas existentes fue perfecta.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Gómez",
    role: "Team Lead, DesignStudio",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "Nuestro equipo de diseño depende de la colaboración visual. TaskMate nos permite organizar nuestros proyectos de manera eficiente y mantener a todos en la misma página. La función de comentarios en tiempo real es invaluable.",
    rating: 4,
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(interval)
  }, [current, autoplay])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-12 shadow-lg shadow-purple-900/5 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-transparent rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-fuchsia-500/10 to-transparent rounded-tl-full"></div>
        <div className="absolute top-10 right-10 text-fuchsia-500/20 text-6xl font-serif">"</div>

        <div className="relative h-[300px] md:h-[220px]">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    <img
                      src={testimonials[current].image || "/placeholder.svg"}
                      alt={testimonials[current].name}                    
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonials[current].rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                      />
                    ))}
                  </div>
                  <p className="text-white/80 italic mb-4">"{testimonials[current].content}"</p>
                  <div>
                    <h4 className="text-white font-medium">{testimonials[current].name}</h4>
                    <p className="text-white/60 text-sm">{testimonials[current].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8">
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1)
                  setCurrent(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current ? "bg-violet-500 w-6" : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


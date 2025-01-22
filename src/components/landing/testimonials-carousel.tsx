import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "TaskMate ha transformado la forma en que gestionamos nuestros proyectos. Es increíblemente intuitivo y potente.",
    author: "Director de Tecnología",
    company: "Empresa Global Tech",
  },
  {
    quote:
      "La mejor herramienta de gestión de proyectos que hemos utilizado. Ha mejorado significativamente nuestra productividad.",
    author: "Gerente de Proyecto",
    company: "Consultora Digital",
  },
  {
    quote:
      "Desde que implementamos TaskMate, nuestra eficiencia ha aumentado en un 40%. Es una herramienta imprescindible.",
    author: "Líder de Equipo",
    company: "Startup Innovadora",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () =>
    setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="relative mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              aria-label="Testimonio anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 transform"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              aria-label="Siguiente testimonio"
              className="absolute right-0 top-1/2 -translate-y-1/2 transform"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="overflow-hidden px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <Quote className="mx-auto mb-6 h-12 w-12 text-blue-600" />
                <blockquote className="mb-6 text-2xl font-medium">
                  {testimonials[current].quote}
                </blockquote>
                <div className="text-lg font-semibold">
                  {testimonials[current].author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonials[current].company}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === current ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

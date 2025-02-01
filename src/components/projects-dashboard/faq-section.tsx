import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "¿Qué es Jira y cómo puede ayudar a mi equipo?",
    answer: "Jira es una herramienta de gestión de proyectos que ayuda a los equipos a planificar, rastrear y gestionar su trabajo. Proporciona funciones como tableros Kanban, seguimiento de problemas, informes y más para mejorar la productividad del equipo.",
  },
  {
    question: "¿Cuántos usuarios puedo tener en mi equipo?",
    answer: "El número de usuarios depende del plan que elijas. El plan Free permite hasta 10 usuarios, el Standard hasta 100 usuarios, y el Premium ofrece usuarios ilimitados para equipos más grandes.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se reflejarán en tu próxima factura, y los beneficios del nuevo plan estarán disponibles inmediatamente.",
  },
  {
    question: "¿Qué tipo de soporte ofrecen?",
    answer: "Ofrecemos diferentes niveles de soporte según tu plan. El plan Premium incluye soporte prioritario 24/7, mientras que los planes Free y Standard tienen acceso a nuestra base de conocimientos y soporte por correo electrónico.",
  },
  {
    question: "¿Puedo integrar Jira con otras herramientas?",
    answer: "Sí, Jira se integra con una amplia gama de herramientas populares como Slack, GitHub, Bitbucket y más. Las integraciones disponibles varían según el plan que elijas.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="container px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border bg-background shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t p-4 text-gray-500">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


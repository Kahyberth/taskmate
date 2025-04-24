import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "¿Qué es TaskMate?",
    answer:
      "TaskMate es una aplicación de gestión de tareas y proyectos diseñada para ayudar a equipos de todos los tamaños a organizar su trabajo, colaborar eficientemente y aumentar su productividad. Ofrece funciones como tableros Kanban, seguimiento de tiempo, integraciones con herramientas populares y mucho más.",
  },
  {
    question: "¿Cómo puedo empezar a usar TaskMate?",
    answer:
      "Puedes comenzar registrándote para una prueba gratuita de 14 días sin necesidad de tarjeta de crédito. Simplemente completa el formulario de registro en nuestra página principal, verifica tu correo electrónico y estarás listo para comenzar a organizar tus proyectos y tareas.",
  },
  {
    question: "¿TaskMate ofrece integraciones con otras herramientas?",
    answer:
      "Sí, TaskMate se integra con una amplia variedad de herramientas populares como GitHub, Slack, Google Drive, Microsoft Teams, Zoom y muchas más. Estas integraciones te permiten centralizar tu flujo de trabajo y aumentar la eficiencia de tu equipo.",
  },
  {
    question: "¿Puedo usar TaskMate en dispositivos móviles?",
    answer:
      "Absolutamente. TaskMate está disponible como aplicación móvil para iOS y Android, permitiéndote gestionar tus tareas y proyectos desde cualquier lugar. La aplicación móvil ofrece la mayoría de las funciones disponibles en la versión de escritorio, con una interfaz optimizada para pantallas más pequeñas.",
  },
  {
    question: "¿Qué nivel de soporte ofrece TaskMate?",
    answer:
      "El nivel de soporte depende del plan que elijas. Todos los planes incluyen soporte por email, mientras que los planes Pro y Enterprise ofrecen soporte prioritario. Los clientes Enterprise también disfrutan de soporte 24/7 y un gestor de cuenta dedicado para ayudarles con cualquier problema o consulta.",
  },
  {
    question: "¿Cómo funciona la integración con Inteligencia Artificial?",
    answer:
      "TaskMate 2.0 incorpora tecnologías avanzadas de IA que te ayudan a trabajar de manera más inteligente. Nuestro asistente virtual puede redactar correos electrónicos, resumir reuniones, sugerir próximos pasos en tus proyectos y automatizar tareas repetitivas. Además, nuestros algoritmos de análisis predictivo pueden identificar posibles cuellos de botella en tus proyectos antes de que ocurran, permitiéndote tomar medidas preventivas.",
  },
]

export function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`bg-violet-200/20 dark:bg-white/5 backdrop-blur-md rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 ${
            activeIndex === index ? "shadow-lg shadow-purple-900/10" : ""
          }`}
        >
          <button
            className="w-full text-left p-6 flex justify-between items-center"
            onClick={() => toggleItem(index)}
            aria-expanded={activeIndex === index}
          >
            <h3 className="text-black dark:text-white font-medium text-lg">{faq.question}</h3>
            <div
              className={`ml-4 flex-shrink-0 h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center transition-transform duration-300 ${
                activeIndex === index ? "rotate-180 " : ""
              }`}
            >
              <ChevronDown
                className={`h-4 w-4 transition-colors ${activeIndex === index ? "text-violet-400" : "text-white/60"}`}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 dark:text-white/70 text-black/70">
                  <div className="border-t border-violet-300/40 dark:border-white/10 pt-4">{faq.answer}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}


import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const stats = [
  { label: "Equipos activos", value: "1,000+" },
  { label: "Países", value: "190+" },
  { label: "Proyectos completados", value: "1M+" },
  { label: "Satisfacción del cliente", value: "98%" },
]

export function StatsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="container px-4 py-16">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-blue-600">{stat.value}</div>
            <div className="mt-2 text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}


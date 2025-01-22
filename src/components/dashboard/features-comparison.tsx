import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const plans = [
  {
    name: "Free",
    price: "0",
    features: [
      { name: "Hasta 10 usuarios", included: true },
      { name: "Proyectos ilimitados", included: true },
      { name: "Tableros Kanban básicos", included: true },
      { name: "Informes básicos", included: true },
      { name: "Integraciones limitadas", included: false },
      { name: "Soporte prioritario", included: false },
      { name: "Características avanzadas", included: false },
    ],
  },
  {
    name: "Standard",
    price: "7",
    features: [
      { name: "Hasta 100 usuarios", included: true },
      { name: "Proyectos ilimitados", included: true },
      { name: "Tableros Kanban avanzados", included: true },
      { name: "Informes personalizados", included: true },
      { name: "Integraciones ilimitadas", included: true },
      { name: "Soporte prioritario", included: false },
      { name: "Características avanzadas", included: false },
    ],
  },
  {
    name: "Premium",
    price: "14",
    popular: true,
    features: [
      { name: "Usuarios ilimitados", included: true },
      { name: "Proyectos ilimitados", included: true },
      { name: "Tableros Kanban avanzados", included: true },
      { name: "Informes personalizados", included: true },
      { name: "Integraciones ilimitadas", included: true },
      { name: "Soporte prioritario 24/7", included: true },
      { name: "Características avanzadas", included: true },
    ],
  },
];

export function FeaturesComparison() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="container px-4 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Planes que se adaptan a tu equipo
        </h2>
        <p className="mt-4 text-gray-500 md:text-xl">
          Elige el plan perfecto para tu equipo y escala según tus necesidades
        </p>
      </div>
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {plans.map((plan, planIndex) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: planIndex * 0.1 }}
            className={`relative rounded-lg border bg-background p-6 shadow-lg transition-transform hover:scale-105 ${
              plan.popular ? "border-blue-600" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                Más popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/usuario/mes</span>
              </div>
            </div>
            <ul className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <motion.li
                  key={feature.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.3,
                    delay: planIndex * 0.1 + featureIndex * 0.1,
                  }}
                  className="flex items-center gap-2"
                >
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300" />
                  )}
                  <span className={feature.included ? "" : "text-gray-500"}>
                    {feature.name}
                  </span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mt-8 w-full rounded-md px-4 py-2 font-medium transition-colors ${
                plan.popular
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Comenzar con {plan.name}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

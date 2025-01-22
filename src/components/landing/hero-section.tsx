import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
export function HeroSection() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setIsValid(validateEmail(e.target.value));
    } else {
      setIsValid(null);
    }
  };

  const handleInscription = () => {
    if (isValid) {
      navigate("/auth/register", {
        state: { email },
      });
    }
  }

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="container relative px-4 py-16 md:py-24 mx-auto">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          className="flex flex-col justify-center space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                Nuevo: TaskMate 1.0
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Los buenos resultados comienzan con TaskMate
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-gray-500 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              TaskMate es una aplicación de gestión de tareas y proyectos que te
              ayuda a organizar tu trabajo y a colaborar con tu equipo de manera
              eficiente.
            </motion.p>
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mx-auto w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">
                Dirección de correo electrónico
              </h2>
              <div className="relative">
                <Input
                  className={`w-full pr-10 ${
                    isValid === true
                      ? "border-green-500 focus-visible:ring-green-500"
                      : isValid === false
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  placeholder="tunombre@empresa.com"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  aria-label="Email de trabajo"
                />
                {isValid !== null && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {isValid === false && (
                <p className="text-sm text-red-500">
                  Por favor, introduce un email válido
                </p>
              )}
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={!isValid}
              onClick={handleInscription}
            >
              Inscribirse
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O seguir con
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 transition-opacity group-hover:opacity-10 m-20" />
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="secondary"
                className="w-full relative flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 transition-opacity hover:opacity-20" />
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 2h10v10H2V2zm12 0h10v10H14V2zM2 14h10v10H2V14zm12 0h10v10H14V14z" />
                </svg>
                Microsoft
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute -right-10 top-0 -z-10 h-full w-1/2 bg-gradient-to-bl from-blue-50/10 via-blue-50/15 to-transparent rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
      >
        <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl" />
      </motion.div>
    </section>
  );
}

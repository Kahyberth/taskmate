import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email.includes("@")) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage("Por favor, introduce un email válido");
    }
  };

  return (
    <section className="bg-gray-50 ">
      <div className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Mantente actualizado
            </h2>
            <p className="mt-4 text-gray-500">
              Recibe las últimas noticias y actualizaciones directamente en tu
              bandeja de entrada
            </p>
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full max-w-sm">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className={status === "error" ? "border-red-500" : ""}
              />
              {status === "error" && (
                <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full sm:w-auto"
            >
              {status === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {status === "success" && (
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              )}
              {status === "success" ? "¡Suscrito!" : "Suscribirse"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GeometricShapes } from "@/components/version/geometric-shapes";
import { ScrollReveal } from "@/components/version/scroll-reveal";
import { PasswordStrengthIndicator } from "@/components/version/password-strength-indicator";
import { AuthContext } from "@/context/AuthContext";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }),
    lastName: z.string().min(2, {
      message: "El apellido debe tener al menos 2 caracteres.",
    }),
    email: z.string().email({
      message: "Por favor, introduce un email válido.",
    }),
    company: z.string().min(2, {
      message: "El nombre de la empresa debe tener al menos 2 caracteres.",
    }),
    password: z
      .string()
      .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres.",
      })
      .refine(
        (password) => {
          return (
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
          );
        },
        {
          message:
            "La contraseña debe incluir mayúsculas, minúsculas, números y símbolos.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useContext(AuthContext);
  const router = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      company: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    location.state as { email: string; name: string };
    form.setValue("email", location.state?.email || "");
    form.setValue("name", location.state?.name || "");
  }, [location.state]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router("/", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await register({
      name: values.name,
      lastName: values.lastName,
      email: values.email,
      company: values.company,
      password: values.password,
    })
      .then((res) => {
        if (res.error) {
          form.setError("email", { message: res.error });
          setIsSubmitting(false);
          return;
        }
        setIsSuccess(true);
        setIsSubmitting(false);
      })
      .catch((error) => {
        form.setError("email", { message: error.message });
        setIsSubmitting(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0a29] via-[#170f3e] to-[#1e1248] relative overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
        }}
      ></div>

      {/* Enhanced geometric shapes */}
      <GeometricShapes />

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="max-w-md mx-auto">
          <ScrollReveal>
            <Link
              to="/"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Volver a inicio
            </Link>

            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),rgba(255,255,255,0))]"></div>
                <span className="text-white text-lg font-bold relative z-10">
                  TM
                </span>
              </div>
              <span className="text-white text-2xl font-bold tracking-tight">
                TaskMate
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl shadow-purple-900/10 relative overflow-hidden">
              {/* Decorative corner shapes */}
              <div className="absolute top-0 left-0 w-16 h-16">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-violet-500/30"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16">
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500/30"></div>
              </div>

              {/* Success state */}
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    ¡Registro exitoso!
                  </h2>
                  <p className="text-white/70 text-center mb-4">
                    Tu cuenta ha sido creada correctamente. Serás redirigido en
                    unos momentos.
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Crear una cuenta
                  </h1>
                  <p className="text-white/70 mb-6">
                    Completa el formulario para comenzar a usar TaskMate
                    gratuitamente
                  </p>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">
                                Nombre
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tu nombre"
                                  {...field}
                                  className="bg-white/10 border-white/10 focus:border-violet-500 h-10 text-white placeholder:text-white/40"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">
                                Apellido
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tu apellido"
                                  {...field}
                                  className="bg-white/10 border-white/10 focus:border-violet-500 h-10 text-white placeholder:text-white/40"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="tucorreo@empresa.com"
                                {...field}
                                className="bg-white/10 border-white/10 focus:border-violet-500 h-10 text-white placeholder:text-white/40"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              Nombre de la empresa
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tu empresa"
                                {...field}
                                className="bg-white/10 border-white/10 focus:border-violet-500 h-10 text-white placeholder:text-white/40"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              Contraseña
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                  className="bg-white/10 border-white/10 focus:border-violet-500 h-10 text-white placeholder:text-white/40 pr-10"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <PasswordStrengthIndicator password={field.value} />
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">
                              Confirmar contraseña
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="••••••••"
                                  {...field}
                                  className="bg-white/10 border-white/10 focus:border-violet-500 h-10 text-white placeholder:text-white/40 pr-10"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-purple-500/20 relative overflow-hidden"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registrando...
                          </span>
                        ) : (
                          "Crear cuenta"
                        )}
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></span>
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-center">
                    <p className="text-white/60 text-sm">
                      ¿Ya tienes una cuenta?{" "}
                      <Link
                        to="/"
                        className="text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Iniciar sesión
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>

            <p className="text-white/40 text-xs text-center mt-6">
              Al registrarte, aceptas nuestros{" "}
              <a
                href="#"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Términos de servicio
              </a>{" "}
              y{" "}
              <a
                href="#"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Política de privacidad
              </a>
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

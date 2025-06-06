import type React from "react";

import { useState, useEffect, useRef, useContext } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  Lock,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { AuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login } = useContext(AuthContext);

  // Refs for accessibility
  const emailInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // AI suggestion based on email domain
  useEffect(() => {
    if (email && email.includes("@")) {
      const domain = email.split("@")[1];
      if (domain === "gmail.com") {
        setAiSuggestion(
          "¿Deseas utilizar tu cuenta de Google para iniciar sesión más rápido?"
        );
      } else if (domain === "outlook.com" || domain === "hotmail.com") {
        setAiSuggestion(
          "¿Deseas utilizar tu cuenta de Microsoft para iniciar sesión más rápido?"
        );
      } else {
        setAiSuggestion(null);
      }
    } else {
      setAiSuggestion(null);
    }
  }, [email]);

  // Focus management
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Por favor, ingresa un email válido");
    } else {
      setEmailError(null);
    }
  };

  // Handle password input change with validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value && !validatePassword(value)) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
    } else {
      setPasswordError(null);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!email) {
      setEmailError("El email es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, ingresa un email válido");
      return;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
    

      login({
        email,
        password,
      })


      setLoginSuccess(true);


      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
          setLoginSuccess(false);
          setEmail("");
          setPassword("");
          setRememberMe(false);
        }, 300);
      }, 1000);
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      console.error("Error de inicio de sesión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={modalRef}
        onKeyDown={handleKeyDown}
        className={cn(
          "sm:max-w-md bg-gradient-to-br from-blue-300/30 to-violet-900/40 dark:from-[#170f3e] dark:to-[#0e0a29]",
          "border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white",
          "rounded-xl shadow-lg dark:shadow-[0_0_50px_rgba(138,43,226,0.2)] backdrop-blur-xl",
          "transition-all duration-300 ease-in-out",
          "p-0 overflow-hidden",
          loginSuccess ? "border-green-500/30" : "border-gray-200 dark:border-white/10"
        )}
        aria-labelledby="sign-in-title"
        aria-describedby="sign-in-description"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/30 dark:from-violet-500/20 to-transparent rounded-bl-full -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/40 dark:from-purple-400/20 to-transparent rounded-tr-full -z-10 animate-pulse-slow animation-delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(123,31,162,0.05)_0%,transparent_70%)] -z-10"></div>
  
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-20 -z-10"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
            backgroundRepeat: "repeat",
          }}
        ></div>
  
        {/* Logo and header */}
        <div className="pt-6 px-6">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
              <div className="rounded-full shadow-lg  relative overflow-hidden group flex items-center justify-center">
                <img
                  src="/image/logo.png"
                  alt="TaskMate Logo"
                  width={18}
                  height={18}
                  className="relative z-10"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-white/80">
                TaskMate 2.0
              </span>
            </div>
          </div>
  
          <DialogHeader>
            <DialogTitle
              id="sign-in-title"
              className="text-2xl font-bold text-center"
            >
              Iniciar Sesión
            </DialogTitle>
            <DialogDescription
              id="sign-in-description"
              className="text-gray-600 dark:text-white/60 text-sm text-center mt-1"
            >
              Accede a tu cuenta para continuar
            </DialogDescription>
          </DialogHeader>
        </div>
  
        {/* Success overlay */}
        {loginSuccess && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center z-10 animate-fade-in">
            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-full p-3 animate-scale-in">
              <CheckCircle2 className="h-10 w-10 text-green-500 dark:text-green-400" />
            </div>
          </div>
        )}
  
        {/* Main content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-shake">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error de inicio de sesión</p>
                  <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}
  
            {/* Email field */}
            <div className="space-y-2 text-gray-800 dark:text-white/80">
              <Label
                htmlFor="email"
                className="flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  ref={emailInputRef}
                  type="email"
                  placeholder="tucorreo@empresa.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={cn(
                    "bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus:border-violet-500 h-11",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40",
                    "pl-4 pr-10 transition-all duration-200",
                    "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                    emailError
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  )}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {email && !emailError && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400 animate-fade-in" />
                )}
              </div>
              {emailError && (
                <p
                  id="email-error"
                  className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1 mt-1 animate-fade-in"
                >
                  <AlertCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
            </div>
  
            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-1.5 text-gray-800 dark:text-white/80"
                >
                  <Lock className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                  Contraseña
                </Label>
                <a
                  href="#"
                  className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 text-xs transition-colors flex items-center gap-0.5 group"
                  onClick={(e) => e.preventDefault()}
                >
                  ¿Olvidaste tu contraseña?
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className={cn(
                    "bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus:border-violet-500 h-11",
                    "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 pr-10",
                    "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                    passwordError
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  )}
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50 hover:text-gray-500 dark:hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-full p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p
                  id="password-error"
                  className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1 mt-1 animate-fade-in"
                >
                  <AlertCircle className="h-3 w-3" />
                  {passwordError}
                </p>
              )}
            </div>
  
            {/* Remember me checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-gray-300 dark:border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-gray-700 dark:text-white/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recordar sesión
              </label>
            </div>
  
            {/* AI suggestion */}
            {aiSuggestion && (
              <div className="bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
                <BrainCircuit className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <p className="text-xs text-violet-800 dark:text-white/80">{aiSuggestion}</p>
              </div>
            )}
  
            {/* Sign in button */}
            <Button
              type="submit"
              className={cn(
                "w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-900 hover:from-purple-600 hover:to-indigo-900",
                "border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 relative overflow-hidden",
                "transition-all duration-300 ease-out",
                "group"
              )}
              disabled={isLoading || loginSuccess}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <>
                  Iniciar Sesión
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></span>
                </>
              )}
            </Button>
  
            {/* Divider */}
            <div className="flex items-center justify-center my-2">
              <div className="h-px dark:bg-gray-200 bg-gray-600 dark:bg-white/10 flex-grow"></div>
              <span className="text-gray-500 dark:text-white/50 px-3 text-sm">o</span>
              <div className="h-px dark:bg-gray-200 bg-gray-600 dark:bg-white/10 flex-grow"></div>
            </div>
  
            {/* Social login */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
                    <div className="bg-red-500 w-2 h-2"></div>
                    <div className="bg-green-500 w-2 h-2"></div>
                    <div className="bg-blue-500 w-2 h-2"></div>
                    <div className="bg-yellow-500 w-2 h-2"></div>
                  </div>
                </div>
                Continuar con Microsoft
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
  
            {/* Registration link */}
            <div className="text-center text-gray-600 dark:text-white/60 text-sm">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/auth/register"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </form>
        </div>
  
        {/* Version badge */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-gray-100 dark:bg-white/5 rounded-full px-2 py-0.5 text-[10px] text-gray-500 dark:text-white/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            v2.0
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

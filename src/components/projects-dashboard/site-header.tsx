import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginModal } from "../auth/login";

export function SiteHeader() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded mx-5" />
              <span className="text-xl font-bold">TaskMate</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                to="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Funciones
              </Link>
              <Link
                to="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Guía del producto
              </Link>
              <Link
                to="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Plantillas
              </Link>
              <Link
                to="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Precios
              </Link>
              <Link
                to="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Enterprise
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setIsLoginModalOpen(true)}>
              Iniciar sesión
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">ES</Button>
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center space-x-2 mx-10">
              <div className="h-8 w-8 bg-blue-600 rounded" />
              <span className="text-xl font-bold">TaskMate</span>
            </a>
            <nav className="hidden md:flex gap-6">
              <a
                href="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Funciones
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Planning Poker
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Documentación
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">
              Iniciar sesión
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">ES</Button>
          </div>
        </div>
      </header>
    </>
  );
}

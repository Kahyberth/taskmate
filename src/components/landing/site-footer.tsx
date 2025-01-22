import { Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <h3 className="mb-4 text-sm font-semibold">Producto</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Características
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Integraciones
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Precios
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Seguridad
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Blog
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Documentación
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Guías
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Soporte
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Compañía</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Acerca de
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Carreras
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Contacto
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Partners
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Privacidad
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Términos
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Cookies
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                />
                Licencias
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © 2025 TaskMate. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-blue-600" />
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>

            <a href="#" className="text-gray-500 hover:text-blue-600" />
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>

            <a href="#" className="text-gray-500 hover:text-blue-600" />
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

import { Github, Twitter, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Características
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Integraciones
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Precios
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Seguridad
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Documentación
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Guías
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Soporte
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Compañía</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Acerca de
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Carreras
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Términos
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Licencias
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © 2024 Jira. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-gray-500 hover:text-blue-600">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link to="#" className="text-gray-500 hover:text-blue-600">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link to="#" className="text-gray-500 hover:text-blue-600">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Introducción",
    items: [
      {
        title: "Primeros pasos",
        href: "/docs",
      },
      {
        title: "Instalación",
        href: "/docs/installation",
      },
    ],
  },
  {
    title: "Fundamentos",
    items: [
      {
        title: "Proyectos",
        href: "/docs/projects",
      },
      {
        title: "Tableros",
        href: "/docs/boards",
      },
      {
        title: "Tareas",
        href: "/docs/issues",
      },
    ],
  },
  {
    title: "Guías",
    items: [
      {
        title: "Scrum",
        href: "/docs/scrum",
      },
      {
        title: "Kanban",
        href: "/docs/kanban",
      },
      {
        title: "Reportes",
        href: "/docs/reports",
      },
    ],
  },
  {
    title: "API",
    items: [
      {
        title: "REST API",
        href: "/docs/api/rest",
      },
      {
        title: "Webhooks",
        href: "/docs/api/webhooks",
      },
    ],
  },
]

export function DocsSidebar() {
  const pathname = useLocation()

  return (
    <aside className="fixed hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r py-12 pr-4 md:sticky md:block">
      <nav className="relative space-y-8">
        {sidebarItems.map((section, i) => (
          <div key={i} className="space-y-4">
            <h4 className="text-sm font-semibold">{section.title}</h4>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm hover:bg-gray-100",
                      pathname.pathname === item.href
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-gray-500"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}


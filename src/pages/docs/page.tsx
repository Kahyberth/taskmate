import { DocsHeader } from "@/components/dashboard/docs-header";
import { DocsPagination } from "@/components/dashboard/docs-pagination";

export default function DocsPage() {
  return (
    <div className="max-w-3xl">
      <DocsHeader
        title="Documentación de TaskMate"
        description="Aprende a usar TaskMate para gestionar tus proyectos de manera efectiva."
      />
      <div className="prose prose-blue max-w-none">
        <h2>Introducción</h2>
        <p>
          Bienvenido a la documentación de TaskMate. Aquí encontrarás guías
          detalladas, tutoriales y referencias para ayudarte a sacar el máximo
          provecho de TaskMate.
        </p>

        <h3>¿Qué es TaskMate?</h3>
        <p>
          TaskMate es una herramienta de gestión de proyectos que ayuda a los
          equipos a planificar, rastrear y gestionar su trabajo. Ya sea que
          estés desarrollando software, gestionando un proyecto de marketing o
          supervisando operaciones comerciales, TaskMate se adapta a tus
          necesidades.
        </p>

        <h3>Características principales</h3>
        <ul>
          <li>Tableros Kanban y Scrum personalizables</li>
          <li>Seguimiento avanzado de problemas y tareas</li>
          <li>Informes y paneles de control en tiempo real</li>
          <li>Integraciones con herramientas populares</li>
          <li>Flujos de trabajo automatizados</li>
        </ul>

        <h3>Primeros pasos</h3>
        <p>Para comenzar con TaskMate, te recomendamos seguir estos pasos:</p>
        <ol>
          <li>Configura tu espacio de trabajo</li>
          <li>Invita a tu equipo</li>
          <li>Crea tu primer proyecto</li>
          <li>Personaliza tu tablero</li>
        </ol>
      </div>
      <DocsPagination />
    </div>
  );
}

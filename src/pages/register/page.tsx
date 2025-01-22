
import { RegistrationForm } from "@/components/dashboard/registration-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-7xl">
      <div className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter">
              Crear una cuenta
            </h1>
            <p className="mt-2 text-gray-500">
              Únete a miles de equipos que ya confían en TaskMate
            </p>
          </div>
          <RegistrationForm />
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-gradient-to-bl from-blue-50 via-blue-50/50 to-transparent" />
    </main>
  );
}

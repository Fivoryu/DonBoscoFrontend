import { useState } from "react";
import SuperAdminSB from "../dashboard/Sidebar/SuperAdminSB";
import clsx from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { myBaseUrl } from "@/components/AxiosInstance";
import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={clsx(
        "min-h-screen flex bg-blue-50 text-gray-800",
        sidebarOpen ? "md:pl-64" : "md:pl-16"
      )}
    >
      <SuperAdminSB openSide={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header similar a dashboard */}
        <header className="bg-white shadow flex items-center justify-between px-6 py-3">
          {/* Botón hamburguesa en mobile */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {sidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <h1 className="flex-1 text-center md:text-left text-xl font-semibold text-blue-600">
            Bienvenido a Don Bosco
          </h1>
          <Link
            to="/"
            className="ml-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <HomeIcon className="w-6 h-6" />
            <span className="font-medium">Inicio</span>
          </Link>
        </header>
        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-4xl shadow-2xl border-none rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Información izquierda */}
              <div className="bg-blue-800 text-white p-8 flex flex-col justify-center">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-yellow-300">
                    Bienvenido a Don Bosco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 mb-4">
                    Plataforma para la gestión educativa: acceso para profesores, estudiantes, administrativos y padres.
                  </p>
                  <p className="text-sm text-gray-300">
                    Mejora la comunicación escolar y realiza seguimiento académico en tiempo real.
                  </p>
                </CardContent>
              </div>
              {/* Imagen o promoción derecha */}
              <div className="bg-white p-8 flex items-center justify-center">
                <img
                  src={`${myBaseUrl}/static/img/logo-donbosco.png`}
                  alt="Don Bosco"
                  className="h-40 w-40 object-contain"
                />
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

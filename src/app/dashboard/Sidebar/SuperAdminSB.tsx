import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/app/contexts/AuthContext";
import { SIDEBAR_SECTIONS_SUPERADMIN } from "./SidebarConfig";
import { useSidebarFiltrado } from "./SidebarFilter";
import { SidebarSection } from "./Sidebar";
import {
  Home as HomeIcon,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";

interface SuperAdminSBProps {
  openSide: boolean;     // Control del estado del sidebar
  onToggle: () => void;  // Función para alternar openSide
  sections?: SidebarSection[]; // <-- permite pasar la config
}

export default function SuperAdminSB({ openSide, onToggle, sections }: SuperAdminSBProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { logout, loading, user } = useAuth();
  const navigate = useNavigate();

  // Determina la ruta de inicio según el rol
  let homePath = "/dashboard/superadmin";
  if (user) {
    const rol = user.rol.nombre.toLowerCase();
    if (rol === "admin") homePath = "/dashboard/admin";
    else if (rol === "profesor") homePath = "/dashboard/profesor";
    // Agrega más roles si es necesario
  }

  if (loading) return null;

  // Filtrar secciones/ítems según roles
  const paquetesFiltrados: SidebarSection[] =
    useSidebarFiltrado(sections ?? SIDEBAR_SECTIONS_SUPERADMIN);

  const toggleSection = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <>
      {/** ------------------------------------------------------
          1) BOTÓN “HAMBURGUESA” en MOBILE: posicionado, aparece sobre el contenido
      ------------------------------------------------------- */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={onToggle}
          className="flex items-center justify-center p-2 bg-white shadow rounded-md hover:bg-gray-100 transition-colors"
        >
          {openSide ? (
            <CloseIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <MenuIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/** ------------------------------------------------------
          2) BACKDROP EN MOBILE: solo visible cuando openSide===true
      ------------------------------------------------------- */}
      <div
        className={clsx(
          "fixed inset-0 bg-black bg-opacity-30 transition-opacity z-40 md:hidden",
          openSide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onToggle}
      />

      {/** ------------------------------------------------------
          3) SIDEBAR RESPONSIvo
             - Mobile: fixed y se desplaza con translate-x
             - Desktop: relativo y cambia ancho w-64 / w-16
      ------------------------------------------------------- */}
      <aside
        className={clsx(
          "bg-white shadow flex flex-col h-screen z-50 transform transition-transform duration-200 fixed top-0 left-0",
          // Mobile: slide in/out
          openSide ? "w-64 translate-x-0" : "w-16 -translate-x-full",
          // Desktop: ancho según estado, siempre visible
          openSide ? "md:w-64" : "md:w-16",
          "md:translate-x-0 md:transition-none"
        )}
      >
        {/** ------------------------------------------------------
            4) CABECERA DEL SIDEBAR:
               - HomeIcon + <span>Inicio</span> (solo si openSide===true)
               - Botón de toggle (siempre visible junto al HomeIcon).
               - En mobile: muestra ☰ / × ; en desktop: « / »
        ------------------------------------------------------- */}
        <div className="flex items-center p-4 border-b">
          <Link
            to={homePath}
            className="flex items-center gap-2 text-blue-600"
          >
            <HomeIcon className="w-6 h-6" />
            {openSide && (
              <span className="text-xl font-bold transition-opacity duration-200">
                Inicio
              </span>
            )}
          </Link>

          <button
            onClick={onToggle}
            className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            {/* Móvil (< md): hamburguesa / × */}
            <span className="md:hidden">
              {openSide ? (
                <CloseIcon className="w-5 h-5 text-gray-700" />
              ) : (
                <MenuIcon className="w-5 h-5 text-gray-700" />
              )}
            </span>

            {/* Desktop (≥ md): chevrons */}
            <span className="hidden md:inline-flex">
              {openSide ? (
                <ChevronsLeft className="w-5 h-5 text-gray-700" />
              ) : (
                <ChevronsRight className="w-5 h-5 text-gray-700" />
              )}
            </span>
          </button>
        </div>

        {/** ------------------------------------------------------
            5) NAVEGACIÓN (secciones expandibles)
               - Cada sección solo se “togglea” si openSide===true.
               - Si openSide===false, un clic primero expande el sidebar.
        ------------------------------------------------------- */}
        <nav className="flex-1 overflow-y-auto">
          {paquetesFiltrados.map(({ title, titleIcon: TitleIcon, items }) => {
            const isExpanded = !!expanded[title];
            return (
              <div key={title} className="mb-2">
                <div
                  className={clsx(
                    "flex items-center justify-between px-4 py-2 mx-2 rounded-lg cursor-pointer transition-colors",
                    isExpanded
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (!openSide) {
                      // En modo mini, primero expandimos el sidebar
                      onToggle();
                    } else {
                      // Si ya está abierto, sí toggleamos esta sección
                      toggleSection(title);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TitleIcon className="w-5 h-5 shrink-0" />
                    {openSide && (
                      <span className="font-medium transition-opacity duration-200">
                        {title}
                      </span>
                    )}
                  </div>
                  {openSide && (
                    <span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </span>
                  )}
                </div>
                {openSide && (
                  <div
                    className={clsx(
                      "overflow-hidden transition-all duration-500",
                      isExpanded ? "max-h-[1000px]" : "max-h-0"
                    )}
                  >
                    {items.map(({ to, label, icon: Icon }) =>
                      to === "__logout__" ? (
                        <button
                          key={to}
                          onClick={handleLogout}
                          className={clsx(
                            "flex items-center gap-3 px-8 py-2 mx-2 rounded-lg transition-colors w-full text-left",
                            "hover:bg-red-50 text-red-600"
                          )}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          <span>{label}</span>
                        </button>
                      ) : (
                        <NavLink
                          key={to}
                          to={to}
                          className={({ isActive }) =>
                            clsx(
                              "flex items-center gap-3 px-8 py-2 mx-2 rounded-lg transition-colors",
                              isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-blue-50"
                            )
                          }
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          <span>{label}</span>
                        </NavLink>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

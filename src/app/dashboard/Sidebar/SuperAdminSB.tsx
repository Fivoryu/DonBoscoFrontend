// src/app/dashboard/SuperAdminSB.tsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  LogOut,
  Home as HomeIcon,
  Settings,
  Layers,
  Clock as ClockIcon,
  Users as UsersIcon,
  School,
  Building2,
  Grid,
  Table2,
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  UserCheck,
} from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
// import AxiosInstance from "@/components/AxiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const sections: Array<{
  title: string;
  titleIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: NavItem[];
}> = [
  {
    title: "Configuración institucional",
    titleIcon: Settings,
    items: [
      { to: "/dashboard/superadmin/colegios", label: "Colegios", icon: School },
      {
        to: "/dashboard/superadmin/unidades",
        label: "Unidad Educativa",
        icon: Building2,
      },
    ],
  },
  {
    title: "Gestión académica",
    titleIcon: Layers,
    items: [
      { to: "/dashboard/superadmin/modulos", label: "Módulos", icon: Grid },
      { to: "/dashboard/superadmin/aulas", label: "Aulas", icon: Table2 },
      {
        to: "/dashboard/superadmin/calendario",
        label: "Calendario",
        icon: CalendarIcon,
      },
      { to: "/dashboard/superadmin/cursos", label: "Cursos", icon: BookOpen },
      {
        to: "/dashboard/superadmin/materia",
        label: "Materia",
        icon: FileText,
      },
      {
        to: "/dashboard/superadmin/profesor",
        label: "Profesor",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Gestión de Usuarios",
    titleIcon: UsersIcon,
    items: [
      {
        to: "/dashboard/superadmin/usuarios",
        label: "Usuarios",
        icon: UsersIcon,
      },
    ],
  },
  {
    title: "Planificación Académica",
    titleIcon: ClockIcon,
    items: [
      {
        to: "/dashboard/superadmin/horario",
        label: "Horario",
        icon: ClockIcon,
      },
    ],
  },
];

export default function SuperAdminSB() {
  const [openSide, setOpenSide] = useState(true);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();  // Llamar a la función logout del contexto
      navigate("/login");  // Redirigir al login
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <aside
      className={clsx(
        "bg-white shadow transition-all flex flex-col h-screen", // ← h-screen fija altura
        openSide ? "w-64" : "w-16"
      )}
    >
      {/* Branding + Toggle */}
      <div className="flex items-center justify-between p-4">
        <Link
          to="/dashboard/superadmin"
          className="flex items-center gap-2 text-blue-600"
        >
          <HomeIcon className="w-6 h-6" />
          {openSide && <span className="text-xl font-bold">Inicio</span>}
        </Link>
        <button
          onClick={() => setOpenSide((o) => !o)}
          className="p-1 rounded hover:bg-blue-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto">
        {sections.map(({ title, titleIcon: TitleIcon, items }) => (
          <div key={title} className="mb-4">
            {openSide && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                <TitleIcon className="w-4 h-4" />
                {title}
              </div>
            )}
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-blue-50"
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {openSide && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className={clsx(
            "flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-50 transition-colors",
            openSide ? "text-red-600" : "justify-center text-red-600"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {openSide && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

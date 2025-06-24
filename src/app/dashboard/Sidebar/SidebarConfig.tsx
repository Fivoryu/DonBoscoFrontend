// src/config/sidebarConfig.ts
import {
  Settings,
  Layers,
  Users as UsersIcon,
  Clock as ClockIcon,
  School,
  Building2,
  Grid,
  Table2,
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  LibraryBig,
  Library,
  FileType,
  UserCheck,
  User,
  CalendarDays,
  PersonStanding,
  LogIn,
  LogOut, // <--- agrega LogOut
  LucideNotebookPen
} from "lucide-react";

import { PiExam, PiStudentLight } from "react-icons/pi";
import { FaBookOpen, FaChalkboardTeacher } from "react-icons/fa";
import { MdAnalytics, MdSecurity } from "react-icons/md";
import { RiParentLine } from "react-icons/ri"
import { TbLicense, TbReportAnalytics } from "react-icons/tb";

import { SidebarSection } from "./Sidebar";

export const SIDEBAR_SECTIONS_SUPERADMIN: SidebarSection[] = [
  {
    title: "Seguridad",
    titleIcon: MdSecurity,
    roles: [],
    items: [
      { to: "/login/", label: "Iniciar sesión", icon: LogIn, roles: [] }, // CU1
      { to: "__logout__", label: "Cerrar sesión", icon: LogOut, roles: [] }, // CU2
      { to: "/dashboard/superadmin/usuarios", label: "Registrar Usuarios", icon: UsersIcon, roles: ["superadmin"] }, // CU3
      { to: "/dashboard/superadmin/roles", label: "Roles", icon: User, roles: ["superadmin"] },
      { to: "/dashboard/superadmin/admin", label: "Administradores", icon: UserCheck, roles: ["superadmin"] },
      { to: "/dashboard/superadmin/permisos", label: "Permisos", icon: PersonStanding, roles: ["superadmin"] },
    ]
  },
  {
    title: "Configuración institucional",
    titleIcon: Settings,
    roles: ["superadmin", "admin"],
    items: [
      { to: "/dashboard/superadmin/colegios", label: "Registrar Colegio", icon: School, roles: ["superadmin", "admin"] }, // CU4
      { to: "/dashboard/superadmin/unidades", label: "Registrar Unidad Educativa", icon: Building2, roles: ["superadmin", "admin"] }, // CU5
    ],
  },
  {
    title: "Gestión académica",
    titleIcon: Layers,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { to: "/dashboard/superadmin/modulos", label: "Registrar Módulos", icon: Grid, roles: ["superadmin", "admin"] }, // CU6
      { to: "/dashboard/superadmin/aulas", label: "Registrar Aulas", icon: Table2, roles: ["superadmin", "admin"] }, // CU7
      { to: "/dashboard/superadmin/paralelos", label: "Registrar Paralelos", icon: FileText, roles: ["superadmin", "admin"] }, // CU8
      { to: "/dashboard/superadmin/grados", label: "Registrar Grados", icon: School, roles: ["superadmin", "admin", "profesor"] }, // CU9
      { to: "/dashboard/superadmin/cursos", label: "Registrar Cursos", icon: BookOpen, roles: ["superadmin", "admin", "profesor"] }, // CU10
      { to: "/dashboard/superadmin/especialidad", label: "Registrar Especialidad", icon: FileType, roles: ["superadmin", "admin"] }, // CU??
      { to: "/dashboard/superadmin/profesor", label: "Registrar Profesores", icon: FaChalkboardTeacher, roles: ["superadmin", "admin"] }, // CU13
    ],
  },
  {
    title: "Planificación Académica",
    titleIcon: ClockIcon,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { to: "/dashboard/superadmin/horario", label: "Registrar Horarios", icon: ClockIcon, roles: ["superadmin", "admin", "profesor"] }, // CU11
      { to: "/dashboard/superadmin/materia", label: "Registrar Materia", icon: FaBookOpen, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/superadmin/materia-curso", label: "Registrar Materias – Curso", icon: Library, roles: ["superadmin", "admin"] }, // CU12
      { to: "/dashboard/superadmin/carga-horaria", label: "Asignar Cargas Horarias", icon: ClockIcon, roles: ["superadmin", "admin"] }, // CU14
      { to: "/dashboard/superadmin/clases", label: "Gestionar Clase", icon: FileType, roles: ["superadmin", "admin", "profesor"] }, // CU15
    ],
  },
  {
    title: "Gestión Estudiantil",
    titleIcon: PiStudentLight,
    roles: ["superadmin", "admin", "profesor", "tutor"],
    items: [
      { to: "/dashboard/superadmin/alumnos", label: "Gestionar Estudiantes", icon: PiStudentLight, roles: ["superadmin"] }, // CU16
      { to: "/dashboard/superadmin/tutores", label: "Gestionar Tutores", icon: RiParentLine, roles: ["superadmin", "admin"] }, // CU17
      { to: "/dashboard/superadmin/asistencia", label: "Registrar asistencia digital", icon: Grid, roles: ["superadmin", "admin", "profesor", "tutor"] }, // CU19
      { to: "/dashboard/superadmin/licencia", label: "Gestionar Licencias Estudiantiles", icon: TbLicense, roles: ["superadmin", "admin", "profesor", "tutor"] }, // CU23
    ]
  },
  {
    title: "Evaluación Académica",
    titleIcon: BookOpen,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { to: "/dashboard/superadmin/calendario-academico", label: "Gestionar Calendario académico", icon: CalendarIcon, roles: ["superadmin", "admin"] }, // CU18
      { to: "/dashboard/superadmin/nota-actividad", label: "Registrar Calificaciones", icon: LucideNotebookPen, roles: ["superadmin", "admin", "profesor"] }, // CU20
      { to: "/dashboard/superadmin/nota-final", label: "Generar Boletines", icon: BookOpen, roles: ["superadmin", "admin", "profesor"] }, // CU21
      { to: "/dashboard/superadmin/analisis/rendimiento-academico", label: "Analizar Rendimiento Académico", icon: TbReportAnalytics, roles: ["superadmin", "admin", "profesor"] }, // CU22
    ]
  },
];

export const SIDEBAR_SECTIONS_ADMIN: SidebarSection[] = [
  {
    title: "Seguridad",
    titleIcon: MdSecurity,
    roles: [],
    items: [
      {
        to: "/login/",
        label: "Iniciar sesión",
        icon: LogIn,
        roles: [],
      },
      // --- Cerrar sesión ---
      {
        to: "__logout__",
        label: "Cerrar sesión",
        icon: LogOut,
        roles: [], // visible para cualquier usuario autenticado
      },
    ]
  },
  {
    title: "Gestión académica",
    titleIcon: Layers,
    roles: ["superadmin", "admin", "profesor"], // “profesor” también ve la sección, pero quizá no todos los ítems
    items: [
      { to: "/dashboard/admin/modulos", label: "Módulos", icon: Grid, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/aulas", label: "Aulas", icon: Table2, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/calendario", label: "Calendario", icon: CalendarIcon, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/admin/cursos", label: "Cursos", icon: BookOpen, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/admin/paralelos", label: "Paralelos", icon: FileText, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/materia", label: "Materia", icon: LibraryBig, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/materia-curso", label: "Materia Curso", icon: Library, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/especialidad", label: "Especialidad", icon: FileType, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/profesor", label: "Profesor", icon: FaChalkboardTeacher, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/grados", label: "Grados", icon: School, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/admin/alumnos", label: "Alumnos", icon: PiStudentLight, roles:["superadmin"]},
      { to: "/dashboard/admin/tutores", label: "Tutores", icon: RiParentLine, roles: ["superadmin", "admin"] },
    ],
  },
  {
    title: "Planificación Académica",
    titleIcon: ClockIcon,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { to: "/dashboard/admin/clases", label: "Clases", icon: FileType, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/admin/horario", label: "Horario", icon: ClockIcon, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/admin/tipo-horario", label: "Tipo de Horario", icon: CalendarDays, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/carga-horaria", label: "Carga Horaria", icon: ClockIcon, roles: ["superadmin", "admin"] },
      { to: "/dashboard/admin/calendario-academico", label: "Calendario Académico", icon: CalendarIcon, roles: ["superadmin", "admin"] },
    ],
  },
  {
    title: "Evaluacion",
    titleIcon: BookOpen,
    roles: ["superadmin", "admin", "profesor", "tutor"],
    items: [
      { to: "/dashboard/admin/dimension-evaluacion", label: "Dimension Evaluacion", icon: PiExam, roles: ["superadmin", "admin"]},
      { to: "/dashboard/admin/nota-actividad", label: "Nota Actividad", icon: LucideNotebookPen, roles: ["superadmin", "admin", "profesor"]
      },
      { to: "/dashboard/admin/nota-final", label: "Nota Final", icon: BookOpen, roles: ["superadmin", "admin", "profesor"] },
    ]
  },
  {
    title: "Asistencias y Licencias",
    titleIcon: TbLicense,
    roles: ["superadmin", "admin", "profesor", "tutor"],
    items: [
      { to: "/dashboard/admin/asistencia", label: "Asistencia", icon: Grid, roles: ["superadmin", "admin", "profesor, tutor"] },
      { to: "/dashboard/admin/licencia", label: "Licencia", icon: TbLicense, roles: ["superadmin", "admin", "profesor, tutor"] },
    ]
  },
  {
    title: "Analisis y Reportes",
    titleIcon: MdAnalytics,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { 
        to: "/dashboard/admin/analisis/rendimiento-academico", 
        label: "Analizar Rendimiento Académico", 
        icon: TbReportAnalytics, 
        roles: ["superadmin", "admin", "profesor"] 
      },
    ]
  },
];

export const SIDEBAR_SECTIONS_PROFESOR: SidebarSection[] = [
  {
    title: "Seguridad",
    titleIcon: MdSecurity,
    roles: [],
    items: [
      {
        to: "/login/",
        label: "Iniciar sesión",
        icon: LogIn,
        roles: [],
      },
      // --- Cerrar sesión ---
      {
        to: "__logout__",
        label: "Cerrar sesión",
        icon: LogOut,
        roles: [], // visible para cualquier usuario autenticado
      },
    ]
  },
  {
    title: "Gestión académica",
    titleIcon: Layers,
    roles: ["profesor"], // sólo “profesor” ve esta sección
    items: [
      { to: "/dashboard/profesor/clases", label: "Mis Clases", icon: FileType, roles: ["profesor"] },
      { to: "/dashboard/profesor/curso", label: "Mi Curso", icon: PiStudentLight, roles: ["profesor"] },
    ],
  },
  {
    title: "Planificación Académica",
    titleIcon: ClockIcon,
    roles: ["profesor"],
    items: [
      { to: "/dashboard/profesor/horario", label: "Horario", icon: ClockIcon, roles: ["profesor"] },
    ],
  },
  {
    title: "Gestion Estudiantil",
    titleIcon: PiStudentLight,
    roles: ["profesor"],
    items: [
      { to: "/dashboard/profesor/asistencia", label: "Asistencia", icon: Grid, roles: ["profesor"] },
    ]
  },
  {
    title: "Evaluación",
    titleIcon: BookOpen,
    roles: ["profesor"],
    items: [
      { to: "/dashboard/profesor/nota-actividad", label: "Registrar Calificaciones", icon: LucideNotebookPen, roles: ["profesor"] },
      { to: "/dashboard/profesor/nota-final", label: "Generar Boletines", icon: BookOpen, roles: ["profesor"] },
      { to: "/dashboard/profesor/calendario", label: "Ver Calendario", icon: CalendarDays, roles: ["profesor"] },
    ]
  },
];


export const SIDEBAR_SECTIONS_TUTOR: SidebarSection[] = [
  {
    title: "Seguridad",
    titleIcon: MdSecurity,
    roles: [],
    items: [
      {
        to: "/login/",
        label: "Iniciar sesión",
        icon: LogIn,
        roles: [],
      },
      // --- Cerrar sesión ---
      {
        to: "__logout__",
        label: "Cerrar sesión",
        icon: LogOut,
        roles: [], // visible para cualquier usuario autenticado
      },
    ]
  },
  {
    title: "Estudiantes",
    titleIcon: PiStudentLight,
    roles: ["tutor"],
    items: [
      { to: "/dashboard/tutor/estudiantes", label: "Mis Estudiantes", icon: PiStudentLight, roles: ["tutor"] },
      { to: "/dashboard/tutor/asistencia", label: "Asistencia", icon: Grid, roles: ["tutor"] },
      { to: "/dashboard/tutor/licencia", label: "Licencias Estudiantiles", icon: TbLicense, roles: ["tutor"] },
    ]
  },
  {
    title: "Evaluación",
    titleIcon: BookOpen,
    roles: ["tutor"],
    items: [
      { to: "/dashboard/tutor/calendario", label: "Calendario", icon: CalendarDays, roles: ["tutor"] },
      { to: "/dashboard/tutor/nota-actividad", label: "Calificaciones", icon: LucideNotebookPen, roles: ["tutor"] },
      { to: "/dashboard/tutor/nota-final", label: "Boletines", icon: BookOpen, roles: ["tutor"] },
    ]
  }
]

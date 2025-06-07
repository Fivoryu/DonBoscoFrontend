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
import { FaChalkboardTeacher } from "react-icons/fa";
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
      {
        to: "/login/",
        label: "Iniciar sesión",
        icon: LogIn,
        roles: [],
      },
      // --- Gestión de Usuarios (antes era sección aparte) ---
      { to: "/dashboard/superadmin/usuarios", label: "Usuarios", icon: UsersIcon, roles: ["superadmin"] },
      { to: "/dashboard/superadmin/roles", label: "Roles", icon: User, roles: ["superadmin"] },
      { to: "/dashboard/superadmin/admin", label: "Administradores", icon: UserCheck, roles: ["superadmin"] },
      { to: "/dashboard/superadmin/permisos", label: "Permisos", icon: PersonStanding, roles: ["superadmin"] },
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
    title: "Configuración institucional",
    titleIcon: Settings,
    roles: ["superadmin", "admin"], // sólo “superadmin” o “admin” ven esta sección
    items: [
      {
        to: "/dashboard/superadmin/colegios",
        label: "Colegios",
        icon: School,
        roles: ["superadmin", "admin"],
      },
      {
        to: "/dashboard/superadmin/unidades",
        label: "Unidad Educativa",
        icon: Building2,
        roles: ["superadmin", "admin"],
      },
    ],
  },
  {
    title: "Gestión académica",
    titleIcon: Layers,
    roles: ["superadmin", "admin", "profesor"], // “profesor” también ve la sección, pero quizá no todos los ítems
    items: [
      { to: "/dashboard/superadmin/modulos", label: "Módulos", icon: Grid, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/aulas", label: "Aulas", icon: Table2, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/calendario", label: "Calendario", icon: CalendarIcon, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/superadmin/cursos", label: "Cursos", icon: BookOpen, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/superadmin/paralelos", label: "Paralelos", icon: FileText, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/materia", label: "Materia", icon: LibraryBig, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/materia-curso", label: "Materia Curso", icon: Library, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/especialidad", label: "Especialidad", icon: FileType, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/profesor", label: "Profesor", icon: FaChalkboardTeacher, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/grados", label: "Grados", icon: School, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/superadmin/alumnos", label: "Alumnos", icon: PiStudentLight, roles:["superadmin"]},
      { to: "/dashboard/superadmin/tutores", label: "Tutores", icon: RiParentLine, roles: ["superadmin", "admin"] },
    ],
  },
  {
    title: "Planificación Académica",
    titleIcon: ClockIcon,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { to: "/dashboard/superadmin/clases", label: "Clases", icon: FileType, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/superadmin/horario", label: "Horario", icon: ClockIcon, roles: ["superadmin", "admin", "profesor"] },
      { to: "/dashboard/superadmin/tipo-horario", label: "Tipo de Horario", icon: CalendarDays, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/carga-horaria", label: "Carga Horaria", icon: ClockIcon, roles: ["superadmin", "admin"] },
      { to: "/dashboard/superadmin/calendario-academico", label: "Calendario Académico", icon: CalendarIcon, roles: ["superadmin", "admin"] },
    ],
  },
  {
    title: "Evaluacion",
    titleIcon: BookOpen,
    roles: ["superadmin", "admin", "profesor", "tutor"],
    items: [
      { to: "/dashboard/superadmin/dimension-evaluacion", label: "Dimension Evaluacion", icon: PiExam, roles: ["superadmin", "admin"]},
      { to: "/dashboard/superadmin/nota-actividad", label: "Nota Actividad", icon: LucideNotebookPen, roles: ["superadmin", "admin", "profesor"]
      },
      { to: "/dashboard/superadmin/nota-final", label: "Nota Final", icon: BookOpen, roles: ["superadmin", "admin", "profesor"] },
    ]
  },
  {
    title: "Asistencias y Licencias",
    titleIcon: TbLicense,
    roles: ["superadmin", "admin", "profesor", "tutor"],
    items: [
      { to: "/dashboard/superadmin/asistencia", label: "Asistencia", icon: Grid, roles: ["superadmin", "admin", "profesor, tutor"] },
      { to: "/dashboard/superadmin/licencia", label: "Licencia", icon: TbLicense, roles: ["superadmin", "admin", "profesor, tutor"] },
    ]
  },
  {
    title: "Analisis y Reportes",
    titleIcon: MdAnalytics,
    roles: ["superadmin", "admin", "profesor"],
    items: [
      { 
        to: "/dashboard/superadmin/analisis/rendimiento-academico", 
        label: "Analizar Rendimiento Académico", 
        icon: TbReportAnalytics, 
        roles: ["superadmin", "admin", "profesor"] 
      },
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
      { to: "/dashboard/profesor/alumnos", label: "Mis Alumnos", icon: PiStudentLight, roles: ["profesor"] },
      { to: "/dashboard/profesor/notas", label: "Notas", icon: BookOpen, roles: ["profesor"] },
      { to: "/dashboard/profesor/asistencias", label: "Asistencias", icon: Grid, roles: ["profesor"] },
    ],
  },
  {
    title: "Planificación Académica",
    titleIcon: ClockIcon,
    roles: ["profesor"],
    items: [
      { to: "/dashboard/profesor/horario", label: "Horario", icon: ClockIcon, roles: ["profesor"] },
      { to: "/dashboard/profesor/tipo-horario", label: "Tipo de Horario", icon: CalendarDays, roles: ["profesor"] },
    ],
  },
];

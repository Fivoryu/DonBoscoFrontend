import { Clase } from "@/app/modelos/Academico";
import React, { createContext, useContext, useState } from "react";

interface Colegio {
  id: number;
  nombre: string;
}
interface Unidad {
  id: number;
  nombre: string;
}
interface Curso {
  id: number;
  nombre: string;
}

interface AttendanceWizardState {
  colegioId?: number;
  unidadId?: number;
  cursoId?: number;
  colegio?: Colegio;
  unidad?: Unidad;
  curso?: Curso;
  clase?: Clase;
  tipoAsistencia?: "general" | "clase";
  accion?: "nueva" | "visualizar";
  setColegioId: (id?: number) => void;
  setUnidadId: (id?: number) => void;
  setCursoId: (id?: number) => void;
  setColegio?: (colegio?: Colegio) => void;
  setUnidad?: (unidad?: Unidad) => void;
  setCurso?: (curso?: Curso) => void;
  setClase?: (clase?: Clase) => void;
  setTipoAsistencia: (tipo?: "general" | "clase") => void;
  setAccion: (accion?: "nueva" | "visualizar") => void;
  reset: () => void;
}

const AttendanceWizardContext = createContext<AttendanceWizardState | undefined>(undefined);

export function AttendanceWizardProvider({ children }: { children: React.ReactNode }) {
  const [colegioId, setColegioId] = useState<number | undefined>();
  const [unidadId, setUnidadId] = useState<number | undefined>();
  const [cursoId, setCursoId] = useState<number | undefined>();
  const [colegio, setColegio] = useState<Colegio | undefined>();
  const [unidad, setUnidad] = useState<Unidad | undefined>();
  const [curso, setCurso] = useState<Curso | undefined>();
  const [clase, setClase] = useState<Clase | undefined>();
  const [tipoAsistencia, setTipoAsistencia] = useState<"general" | "clase" | undefined>();
  const [accion, setAccion] = useState<"nueva" | "visualizar" | undefined>();

  const reset = () => {
    setColegioId(undefined);
    setUnidadId(undefined);
    setCursoId(undefined);
    setColegio(undefined);
    setUnidad(undefined);
    setCurso(undefined);
    setTipoAsistencia(undefined);
    setAccion(undefined);
    setClase(undefined);
  };

  return (
    <AttendanceWizardContext.Provider
      value={{
        colegioId,
        unidadId,
        cursoId,
        colegio,
        unidad,
        curso,
        clase,
        tipoAsistencia,
        accion,
        setColegioId,
        setUnidadId,
        setCursoId,
        setColegio,
        setUnidad,
        setCurso,
        setTipoAsistencia,
        setAccion,
        setClase,
        reset,
      }}
    >
      {children}
    </AttendanceWizardContext.Provider>
  );
}

export function useAttendanceWizard() {
  const ctx = useContext(AttendanceWizardContext);
  if (!ctx) throw new Error("useAttendanceWizard debe usarse dentro de AttendanceWizardProvider");
  return ctx;
}

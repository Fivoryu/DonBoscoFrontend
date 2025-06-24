import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as licenciasApi from "../services/licencias.api";
import { Licencia } from "@/app/modelos/Asistencia";

export function useLicencias(tutorId: number) {
  const queryClient = useQueryClient();

  // Obtener licencias del tutor
  const {
    data: licencias = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Licencia[], Error>({
    queryKey: ["licencias", tutorId],
    queryFn: () => licenciasApi.getLicenciasByTutor(tutorId),
  });

  // Crear licencia
  const createLicencia = useMutation<Licencia, Error, Partial<Licencia>>({
    mutationFn: (data) => licenciasApi.createLicencia(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["licencias", tutorId] }),
  });

  // Editar licencia
  const editLicencia = useMutation<Licencia, Error, Partial<Licencia> & { id: number }>({
    mutationFn: (data) => licenciasApi.editLicencia(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["licencias", tutorId] }),
  });

  // Eliminar licencia
  const deleteLicencia = useMutation<void, Error, number>({
    mutationFn: (id) => licenciasApi.deleteLicencia(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["licencias", tutorId] }),
  });

  return {
    licencias,
    isLoading,
    error,
    refetch,
    createLicencia,
    editLicencia,
    deleteLicencia,
  };
}

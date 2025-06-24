import React, { useState, useEffect } from "react";
import AxiosInstance, { myBaseUrl } from "@/components/AxiosInstance"; // Asegúrate de tenerlo configurado
interface Estudiante {
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

const GenerarLicencia = () => {
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteId, setEstudianteId] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tutorId, setTutorId] = useState("");


  useEffect(() => {
    // Obtener estudiantes asignados al tutor
    AxiosInstance.get("/estudiantes/relaciones/mis-estudiantes/")
      .then((res) => {
        setEstudiantes(res.data);
      })
      .catch(() => {
        alert("No se pudieron cargar los estudiantes.");
      });

    AxiosInstance.get("/user/auth/usuarios/perfil/")
      .then((res) => {
        console.log("🧑 Perfil del usuario:", res.data);
        if (res.data.rol?.nombre === "Tutor") {
          setTutorId(res.data.id);  // Aquí es el ID del tutor
          console.log("📌 ID del tutor:", res.data.id);
        }
      })
      .catch(() => {
        alert("No se pudo cargar el perfil del usuario.");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📤 Enviando licencia con tutor_id:", tutorId);

    try {
      const formData = new FormData();
      formData.append("motivo", motivo);
      formData.append("fecha_inicio", fechaInicio);
      formData.append("fecha_fin", fechaFin);
      formData.append("estudiante", estudianteId);
      formData.append("tutor", tutorId); // Agregar el ID del tutor
      if (archivo) {
        formData.append("archivo", archivo); // `archivo` debe ser un File
      }

      await AxiosInstance.post("/api/licencias/crear/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      alert("Licencia solicitada correctamente");
      setMotivo("");
      setFechaInicio("");
      setFechaFin("");
      setEstudianteId("");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al enviar la solicitud.");
    }
  };


  return (
    <div className="bg-white p-6 shadow rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generar Licencia</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Estudiante</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={estudianteId}
            onChange={(e) => setEstudianteId(e.target.value)}
            required
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((est) => (
              <option key={est.usuario.id} value={est.usuario.id}>
                {est.usuario.nombre} {est.usuario.apellido}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block font-medium mb-1">Motivo</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Desde</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Hasta</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </div>
        </div>

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setArchivo(e.target.files[0]);
            }
          }}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Enviar solicitud
        </button>
      </form>
    </div>
  );
};

export default GenerarLicencia;

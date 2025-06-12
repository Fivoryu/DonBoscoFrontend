import { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Estudiante, TutorEstudiante } from "@/app/modelos/Estudiantes";

interface Props {
  initial: TutorEstudiante | null;
  estudiantes: Estudiante[];
  onSave: (relacion: TutorEstudiante | null) => void;
  onCancel: () => void;
}

async function editarUsuarioYRol({
  usuarioId,
  usuarioPayload,
  rolPayload,
  usuarioEndpoint,
  rolEndpoint
}: {
  usuarioId: number;
  usuarioPayload: any;
  rolPayload: any;
  usuarioEndpoint: string;
  rolEndpoint: string;
}) {
  try {
    await AxiosInstance.put(`${usuarioEndpoint}/${usuarioId}/editar/`, usuarioPayload);
    await AxiosInstance.put(`${rolEndpoint}/${usuarioId}/editar/`, {
      ...rolPayload,
      usuario_id: usuarioId,
    });
    return true;
  } catch (err: any) {
    console.error("❌ Error al editar usuario y rol:", err);
    alert("Error: " + JSON.stringify(err.response?.data || err.message));
    return false;
  }
}

export default function TutorFormModal({
  initial,
  estudiantes,
  onSave,
  onCancel
}: Props) {
  const [form, setForm] = useState({
    id: initial?.tutor.usuario.id ?? 0,
    ci: initial?.tutor.usuario.ci ?? "",
    nombre: initial?.tutor.usuario.nombre ?? "",
    apellido: initial?.tutor.usuario.apellido ?? "",
    email: initial?.tutor.usuario.email ?? "",
    username: initial?.tutor.usuario.username ?? "",
    password: "",
    sexo: initial?.tutor.usuario.sexo ?? "M",
    parentesco: initial?.tutor.parentesco ?? "OTR",
    estudiante_id: initial?.estudiante.usuario.id ?? 0,
    fecha_asignacion: initial?.fecha_asignacion?.slice(0, 10) ?? "",
    es_principal: initial?.es_principal ?? false
  });

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.tutor.usuario.id,
        ci: initial.tutor.usuario.ci,
        nombre: initial.tutor.usuario.nombre,
        apellido: initial.tutor.usuario.apellido,
        email: initial.tutor.usuario.email,
        username: initial.tutor.usuario.username,
        password: "",
        sexo: initial.tutor.usuario.sexo,
        parentesco: initial.tutor.parentesco,
        estudiante_id: initial.estudiante.usuario.id,
        fecha_asignacion: initial.fecha_asignacion.slice(0, 10),
        es_principal: initial.es_principal
      });
    } else {
      setForm({
        id: 0,
        ci: "",
        nombre: "",
        apellido: "",
        email: "",
        username: "",
        password: "",
        sexo: "M",
        parentesco: "OTR",
        estudiante_id: 0,
        fecha_asignacion: "",
        es_principal: false
      });
    }
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox && (e.target as HTMLInputElement).checked;
    setForm(f => ({
      ...f,
      [name]: isCheckbox ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!form.ci || !form.nombre || !form.apellido || !form.username || !form.email) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (form.id === 0 && !form.password) {
      alert("La contraseña es obligatoria al crear.");
      return;
    }

    const userPayload: any = {
      ci: form.ci,
      nombre: form.nombre,
      apellido: form.apellido,
      sexo: form.sexo,
      email: form.email,
      username: form.username,
    };

    let tutorId = form.id;

    try {
      if (form.id === 0) {
        // ✅ CREAR usuario y tutor en /register (el backend ya crea el Tutor)
        userPayload.password = form.password;
        userPayload.rol_id = 6; // Tutor
        userPayload.parentesco = form.parentesco;

        const res = await AxiosInstance.post("/user/auth/usuarios/register/", userPayload);
        tutorId = res.data.user.id;
      } else {
        // ✅ EDITAR usuario y tutor (parentesco)
        const ok = await editarUsuarioYRol({
          usuarioId: form.id,
          usuarioPayload: userPayload,
          rolPayload: { parentesco: form.parentesco },
          usuarioEndpoint: "/user/auth/usuarios",
          rolEndpoint: "/estudiantes/tutores"
        });
        if (!ok) return;
      }

      // ✅ Crear o editar relación Tutor-Estudiante
      let respRelacion = null;
      if (form.estudiante_id) {
        const payloadRelacion = {
          tutor_id: tutorId,
          estudiante_id: form.estudiante_id,
          fecha_asignacion: form.fecha_asignacion || new Date().toISOString().slice(0, 10),
          es_principal: form.es_principal
        };

        if (initial && initial.id > 0) {
          respRelacion = await AxiosInstance.put(`/estudiantes/relaciones/${initial.id}/editar/`, payloadRelacion);
        } else {
          respRelacion = await AxiosInstance.post(`/estudiantes/relaciones/crear/`, payloadRelacion);
        }
      }

      onSave(respRelacion?.data ?? null);
    } catch (err: any) {
      console.error("❌ Error en handleSubmit:", err);
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };


  return (
    <FormModal
      title={form.id === 0 ? "Nuevo Tutor" : "Editar Tutor"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <input name="ci" value={form.ci} onChange={handleChange} placeholder="CI" className="border p-2 rounded" />
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="border p-2 rounded" />
        <select name="sexo" value={form.sexo} onChange={handleChange} className="border p-2 rounded">
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" className="border p-2 rounded" />
        {form.id === 0 && (
          <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" className="border p-2 rounded" type="password" />
        )}
        <select name="parentesco" value={form.parentesco} onChange={handleChange} className="border p-2 rounded col-span-2">
          <option value="PAD">Padre</option>
          <option value="MAD">Madre</option>
          <option value="TUT">Tutor Legal</option>
          <option value="HER">Hermano/a</option>
          <option value="OTR">Otro</option>
        </select>
        <select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} className="border p-2 rounded col-span-2">
          <option value={0}>-- Seleccione estudiante --</option>
          {estudiantes.map(e => (
            <option key={e.usuario.id} value={e.usuario.id}>
              {e.usuario.nombre} {e.usuario.apellido} - {e.rude}
            </option>
          ))}
        </select>
        <input type="date" name="fecha_asignacion" value={form.fecha_asignacion} onChange={handleChange} className="border p-2 rounded col-span-1" />
        <label className="col-span-1 flex items-center gap-2">
          <input type="checkbox" name="es_principal" checked={form.es_principal} onChange={handleChange} />
          ¿Principal?
        </label>
      </div>
    </FormModal>
  );
}

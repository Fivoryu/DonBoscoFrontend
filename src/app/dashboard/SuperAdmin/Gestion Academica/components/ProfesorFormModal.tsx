// src/app/dashboard/SuperAdmin/GestionPersonal/components/ProfesorFormModal.tsx
import React, { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Especialidad, ProfesorEspecialidad } from "@/app/modelos/Personal";

interface Props {
  initial: ProfesorEspecialidad | null;
  especialidades: Especialidad[];
  onCancel: () => void;
  onSave: (pe: ProfesorEspecialidad) => void;
}

export default function ProfesorFormModal({
  initial,
  especialidades,
  onCancel,
  onSave,
}: Props) {
  // Estado del formulario para Usuario + ProfesorEspecialidad
  const [form, setForm] = useState({
    // campos de Usuario
    id:                initial?.profesor.usuario.id     ?? 0,
    ci:                initial?.profesor.usuario.ci     ?? "",
    foto:              initial?.profesor.usuario.foto   ?? "",
    nombre:            initial?.profesor.usuario.nombre ?? "",
    apellido:          initial?.profesor.usuario.apellido ?? "",
    sexo:              initial?.profesor.usuario.sexo   ?? "M",
    email:             initial?.profesor.usuario.email  ?? "",
    fecha_nacimiento:  initial?.profesor.usuario.fecha_nacimiento?.slice(0,10) ?? "",
    username:          initial?.profesor.usuario.username ?? "",
    password:          "",
    
    // campos de asignación
    especialidad_id:   initial?.especialidad.id        ?? 0,
    fecha_asignacion:  initial?.fecha_asignacion.slice(0,10) ?? "",
  });

  // Sincronizar form al cambiar initial
  useEffect(() => {
    if (initial) {
      setForm({
        id:                initial.profesor.usuario.id,
        ci:                initial.profesor.usuario.ci,
        foto:              initial.profesor.usuario.foto ?? "",
        nombre:            initial.profesor.usuario.nombre,
        apellido:          initial.profesor.usuario.apellido,
        sexo:              initial.profesor.usuario.sexo,
        email:             initial.profesor.usuario.email,
        fecha_nacimiento:  initial.profesor.usuario.fecha_nacimiento?.slice(0,10) ?? "",
        username:          initial.profesor.usuario.username,
        password:          "",

        especialidad_id:   initial.especialidad.id,
        fecha_asignacion:  initial.fecha_asignacion.slice(0,10),
      });
    } else {
      setForm(f => ({
        ...f,
        id: 0,
        ci: "",
        foto: "",
        nombre: "",
        apellido: "",
        sexo: "M",
        email: "",
        fecha_nacimiento: "",
        username: "",
        password: "",

        especialidad_id: 0,
        fecha_asignacion: "",
      }));
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    // 1) Validaciones
    if (!form.ci.trim() || !form.nombre.trim() || !form.apellido.trim()) {
      alert("CI, nombre y apellido son obligatorios.");
      return;
    }
    if (!form.email.trim() || !form.username.trim()) {
      alert("Email y username son obligatorios.");
      return;
    }
    if (form.id === 0 && !form.password) {
      // form.id===0 significa “nuevo profesor”
      alert("La contraseña es obligatoria al crear.");
      return;
    }

    // 2) Determina si estamos editando un usuario existente
    const isEditingUser   = form.id > 0;
    // 3) Y si ya había una asignación existente
    const hasExistingAsig = Boolean(initial && initial.id > 0);

    // 4) Payload plano para el usuario (PUT o POST según isEditingUser)
    const userPayload: any = {
      ci:               form.ci,
      foto:             form.foto || null,
      nombre:           form.nombre,
      apellido:         form.apellido,
      sexo:             form.sexo,
      email:            form.email,
      fecha_nacimiento: form.fecha_nacimiento || null,
      username:         form.username,
    };
    if (!isEditingUser) {
      // solo al crear metemos password y rol
      userPayload.password = form.password!;
      userPayload.rol_id   = 5; // ID “profesor”
    }

    // 5) Payload para asignación de especialidad (si corresponde)
    const specPayload: any = {
      especialidad:     form.especialidad_id || null,
      fecha_asignacion: form.fecha_asignacion || null,
    };

    try {
      let respUser, respPE;

      // ——— USUARIO ———
      if (isEditingUser) {
        // Editamos al profesor existente
        respUser = await AxiosInstance.put(
          `/personal/profesores/${form.id}/editar/`,
          userPayload
        );
      } else {
        // Creamos nuevo profesor (y usuario) en backend
        respUser = await AxiosInstance.post(
          `/personal/profesores/crear/`,
          { usuario: userPayload, estado: true }
        );
      }

      // extraemos el id real de profesor para la asignación
      const profesorId = isEditingUser
        ? form.id
        : respUser.data.usuario.id;

      // ——— ASIGNACIÓN ———
      if (hasExistingAsig) {
        // Si ya existía, hacemos PUT sobre esa asignación
        respPE = await AxiosInstance.put(
          `/personal/asignaciones/${initial!.id}/editar/`,
          specPayload
        );

      } else if (form.especialidad_id) {
        // Si no existía, pero el usuario eligió especialidad, la creamos
        respPE = await AxiosInstance.post(
          `/personal/asignaciones/crear/`,
          { profesor: profesorId, ...specPayload }
        );

      } else {
        // ni existía, ni se eligió → devolvemos stub vacío
        respPE = { data: null };
      }

      // 6) Llamamos a onSave con el resultado de la asignación
      onSave(respPE.data);

    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };





  return (
    <FormModal
      title={initial ? "Editar Profesor" : "Nuevo Profesor"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
      {/* Campos de Usuario */}
      <div className="grid gap-4">
        <div>
          <label className="block mb-1">Foto URL</label>
          <input
            type="text"
            name="foto"
            value={form.foto}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block mb-1">CI</label>
          <input
            name="ci"
            value={form.ci}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1">Sexo</label>
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Password sólo al crear */}
        {!initial && (
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {/* Especialidad y fecha */}
        <div>
          <label className="block mb-1">Especialidad</label>
          <select
            name="especialidad_id"
            value={form.especialidad_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value={0}>— selecciona —</option>
            {especialidades.map(e => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Fecha de asignación</label>
          <input
            type="date"
            name="fecha_asignacion"
            value={form.fecha_asignacion}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>
    </FormModal>
  );
}

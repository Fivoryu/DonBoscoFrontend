import React, { useState, useEffect } from "react";
import FormModal from "@/components/FormModal";
import AxiosInstance from "@/components/AxiosInstance";
import { Admin, Puesto } from "@/app/modelos/Usuarios";
import { UnidadEducativa } from "@/app/modelos/Institucion";

interface Props {
  initial: Admin | null;
  onCancel: () => void;
  onSave: (admin: Admin) => void;
}

export default function AdminFormModal({ initial, onCancel, onSave }: Props) {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [unidades, setUnidades] = useState<UnidadEducativa[]>([]);

  // Form state
  const [form, setForm] = useState({
    // Usuario
    id: initial?.usuario.id ?? 0,
    ci: initial?.usuario.ci ?? "",
    foto: initial?.usuario.foto ?? "",
    nombre: initial?.usuario.nombre ?? "",
    apellido: initial?.usuario.apellido ?? "",
    sexo: initial?.usuario.sexo ?? "M",
    email: initial?.usuario.email ?? "",
    fecha_nacimiento: initial?.usuario.fecha_nacimiento?.slice(0, 10) ?? "",
    username: initial?.usuario.username ?? "",
    password: "",
    // Admin
    puesto_id: initial?.puesto?.id ?? "",
    unidad_id: initial?.unidad?.id ?? "",
    estado: initial?.estado ?? true,
  });

  useEffect(() => {
    AxiosInstance.get<Puesto[]>("/user/auth/puestos/listar-puestos/")
      .then(res => setPuestos(res.data))
      .catch(() => setPuestos([]));
    AxiosInstance.get<UnidadEducativa[]>("/institucion/unidades-educativas/listar/")
      .then(res => setUnidades(res.data))
      .catch(() => setUnidades([]));
  }, []);

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.usuario.id,
        ci: initial.usuario.ci,
        foto: initial.usuario.foto ?? "",
        nombre: initial.usuario.nombre,
        apellido: initial.usuario.apellido,
        sexo: initial.usuario.sexo,
        email: initial.usuario.email,
        fecha_nacimiento: initial.usuario.fecha_nacimiento?.slice(0, 10) ?? "",
        username: initial.usuario.username,
        password: "",
        puesto_id: initial.puesto?.id ?? "",
        unidad_id: initial.unidad?.id ?? "",
        estado: initial.estado,
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
        puesto_id: "",
        unidad_id: "",
        estado: true,
      }));
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox"
        ? (e.currentTarget as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = async () => {
    // Validaciones mínimas
    if (!form.ci.trim() || !form.nombre.trim() || !form.apellido.trim()) {
      alert("CI, nombre y apellido son obligatorios.");
      return;
    }
    if (!form.email.trim() || !form.username.trim()) {
      alert("Email y username son obligatorios.");
      return;
    }
    if (form.id === 0 && !form.password) {
      alert("La contraseña es obligatoria al crear.");
      return;
    }

    // Payload usuario
    const userPayload: any = {
      ci: form.ci,
      foto: form.foto || null,
      nombre: form.nombre,
      apellido: form.apellido,
      sexo: form.sexo,
      email: form.email,
      fecha_nacimiento: form.fecha_nacimiento || null,
      username: form.username,
      estado: form.estado,
    };
    if (!initial) {
      userPayload.password = form.password;
      userPayload.rol_id = 2; // ID del rol Admin (ajusta según tu backend)
    }

    // Payload admin
    const adminPayload: any = {
      puesto_id: form.puesto_id || null,
      unidad_id: form.unidad_id || null,
      estado: form.estado,
    };

    try {
      let respUser, respAdmin;
      if (form.id > 0) {
        // Editar usuario
        respUser = await AxiosInstance.put(
          `/user/auth/admins/${form.id}/editar-admin/`,
          userPayload
        );
      } else {
        // Crear usuario
        respUser = await AxiosInstance.post(
          `/user/auth/admins/crear-admin/`,
          userPayload
        );
      }
      // Corrige aquí: respUser.data puede ser el usuario o {user: usuario}
      let usuarioId: number;
      if (form.id > 0) {
        usuarioId = form.id;
      } else if (respUser.data?.user?.id) {
        usuarioId = respUser.data.user.id;
      } else if (respUser.data?.id) {
        usuarioId = respUser.data.id;
      } else {
        alert("No se pudo obtener el ID del usuario creado.");
        return;
      }

      if (initial) {
        // Editar admin
        respAdmin = await AxiosInstance.put(
          `/user/auth/admins/${usuarioId}/editar-admin/`,
          adminPayload
        );
      } else {
        // Crear admin
        respAdmin = await AxiosInstance.post(
          `/user/auth/admins/crear-admin/`,
          { usuario_id: usuarioId, ...adminPayload }
        );
      }
      onSave(respAdmin.data);
    } catch (err: any) {
      alert("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <FormModal
      title={initial ? "Editar Administrador" : "Nuevo Administrador"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar"
    >
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
        <div>
          <label className="block mb-1">Unidad Educativa</label>
          <select
            name="unidad_id"
            value={form.unidad_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">— Ninguna —</option>
            {unidades.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Puesto</label>
          <select
            name="puesto_id"
            value={form.puesto_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">— Ninguno —</option>
            {puestos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="estado"
              checked={form.estado}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>
      </div>
    </FormModal>
  );
}

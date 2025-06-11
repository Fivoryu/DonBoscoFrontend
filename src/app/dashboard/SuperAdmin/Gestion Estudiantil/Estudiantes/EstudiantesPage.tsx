// src/app/dashboard/SuperAdmin/Gestion Estudiantil/Estudiantes/EstudiantesPage.tsx

import { useEffect, useMemo, useState } from "react";
import { Estudiante } from "@/app/modelos/Estudiantes";
import {
    eliminarEstudiante,
    getEstudiantes
} from "@/app/helpers/estudiantesHelpers";
import EstudianteFormModal from "./components/EstudianteFormModal";
import { Plus, Pencil, Trash } from "lucide-react";
import Table from "@/components/Table";

export interface Row {
    usuarioId: number;
    ci: string;
    nombreCompleto: string;
    email: string;
    sexo: string;
    rude: string;
    curso: string;
    unidad: string;
}

export default function EstudiantesPage() {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [estudianteActual, setEstudianteActual] = useState<Estudiante | null>(null);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof Row>("nombreCompleto");
    const [asc, setAsc] = useState(true);

    const fetchEstudiantes = async () => {
        const res = await getEstudiantes();
        setEstudiantes(res);
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const handleCreate = () => {
        setModoEdicion(false);
        setEstudianteActual(null);
        setModalOpen(true);
    };

    const handleEdit = (est: Estudiante) => {
        setModoEdicion(true);
        setEstudianteActual(est);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar estudiante?")) return;
        if (!id) {
            alert("ID de estudiante inválido");
            return;
        }
        await eliminarEstudiante(id);
        await fetchEstudiantes();
    };

    const handleSave = () => {
        setModalOpen(false);
        fetchEstudiantes();
    };

    const rows = useMemo<Row[]>(() =>
        estudiantes.map(e => ({
            id: e.usuario.id,
            usuarioId: e.usuario.id,
            ci: e.usuario.ci,
            nombreCompleto: `${e.usuario.nombre} ${e.usuario.apellido}`,
            email: e.usuario.email,
            sexo: e.usuario.sexo,
            rude: e.rude,
            curso: e.curso?.nombre || "—",
            unidad: e.unidad?.nombre || "—"
        })),
        [estudiantes]
    );

    const filtered = useMemo(() => {
        const t = search.trim().toLowerCase();
        if (!t) return rows;
        return rows.filter(r =>
            r.nombreCompleto.toLowerCase().includes(t) ||
            r.ci.toLowerCase().includes(t) ||
            r.rude.toLowerCase().includes(t) ||
            r.email.toLowerCase().includes(t)
        );
    }, [search, rows]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const A = a[sortKey] ?? "";
            const B = b[sortKey] ?? "";
            if (A === B) return 0;
            if (typeof A === "string" && typeof B === "string") {
                return asc ? A.localeCompare(B) : B.localeCompare(A);
            }
            return asc ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
        });
    }, [filtered, sortKey, asc]);

    const toggleSort = (key: keyof Row) => {
        if (sortKey === key) {
            setAsc(!asc);
        } else {
            setSortKey(key);
            setAsc(true);
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Gestión de Estudiantes</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo
                </button>
            </div>

            <input
                type="text"
                placeholder="Buscar estudiante..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <Table>
                <thead className="bg-blue-50 text-blue-600 select-none">
                    <tr>
                        {(["ci", "nombreCompleto", "email", "sexo", "rude", "curso", "unidad"] as Array<keyof Row>).map(key => (
                            <th
                                key={key}
                                onClick={() => toggleSort(key)}
                                className="px-4 py-3 cursor-pointer"
                            >
                                <div className="inline-flex gap-1 items-center">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    {sortKey === key && (asc ? "↑" : "↓")}
                                </div>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                                Sin estudiantes
                            </td>
                        </tr>
                    ) : (
                        sorted.map(row => (
                            <tr key={row.usuarioId} className="hover:bg-blue-50">
                                <td className="px-4 py-2">{row.ci}</td>
                                <td className="px-4 py-2">{row.nombreCompleto}</td>
                                <td className="px-4 py-2">{row.email}</td>
                                <td className="px-4 py-2">{row.sexo}</td>
                                <td className="px-4 py-2">{row.rude}</td>
                                <td className="px-4 py-2">{row.curso}</td>
                                <td className="px-4 py-2">{row.unidad}</td>
                                <td className="px-4 py-2 text-right space-x-2">
                                    <button onClick={() => handleEdit(estudiantes.find(e => e.usuario.id === row.usuarioId)!)} className="text-blue-600">

                                        <Pencil className="w-4 h-4 inline" />
                                    </button>
                                
                                        <button onClick={() => handleDelete(row.usuarioId)} className="text-red-600">

                                            <Trash className="w-4 h-4 inline" />
                                        </button>
                                    
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {modalOpen && (
                <EstudianteFormModal
                    open={modalOpen} // opcional, puede eliminarse si controlas visibilidad externamente
                    modoEdicion={modoEdicion}
                    estudianteActual={estudianteActual}
                    onSave={handleSave}
                    onClose={() => {
                        setModalOpen(false);
                        setModoEdicion(false);
                        setEstudianteActual(null);
                    }}
                />
            )}
        </div>
    );
}

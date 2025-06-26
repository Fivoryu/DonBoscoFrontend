import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    username: string;
}

interface Estudiante {
    id: number;
    usuario: Usuario;
    rude: string;
    estado: boolean;
    curso: {
        nombre: string;
    };
    unidad: {
        nombre: string;
    };
}

const MisEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        fetch("http://127.0.0.1:8000/estudiantes/relaciones/mis-estudiantes/", {
            headers: {
                Authorization: `Token ${token}`, // ← ahora siempre toma el disponible
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al obtener estudiantes");
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setEstudiantes(data);
                } else {
                    console.error("Respuesta no esperada:", data);
                    setEstudiantes([]);
                }
            })
            .catch((err) => {
                console.error("Error cargando estudiantes:", err);
                setError("No se pudieron cargar los estudiantes.");
            });
    }, []);


    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Mis Estudiantes Asignados</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <table className="w-full table-auto border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Correo</th>
                        <th className="border px-4 py-2">Curso</th>
                        <th className="border px-4 py-2">Unidad</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((e) => (
                        <tr key={e.id}>
                            <td className="border px-4 py-2">
                                {e.usuario.nombre} {e.usuario.apellido}
                            </td>
                            <td className="border px-4 py-2">{e.usuario.email}</td>
                            <td className="border px-4 py-2">{e.curso?.nombre}</td>
                            <td className="border px-4 py-2">{e.unidad?.nombre}</td>
                            <td className="border px-4 py-2 text-center">
                                <Link
                                    to={`/dashboard/tutor/boletin/${e.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Ver Boletín
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MisEstudiantes;

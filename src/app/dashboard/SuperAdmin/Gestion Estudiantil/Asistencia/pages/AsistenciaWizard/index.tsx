import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAttendanceWizard } from "../../context/AsistenciaWizardContext";
import SelectSchoolStep from "./steps/SelectSchoolStep";
import SelectUnitStep from "./steps/SelectUnitStep";
import SelectCourseStep from "./steps/SelectCourseStep";
import SelectModeStep from "./steps/SelectModeStep";
import SelectActionStep from "./steps/SelectActionStep";

function WizardSteps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Number(searchParams.get("step") || 1);
  const navigate = useNavigate();
  const {
    colegioId, setColegioId,
    unidadId, setUnidadId,
    cursoId, setCursoId,
    tipoAsistencia, setTipoAsistencia,
    accion, setAccion,
    reset
  } = useAttendanceWizard();

  // Reset wizard al montar/desmontar
  useEffect(() => { reset(); }, []);

  // Avanzar al siguiente paso
  const next = () => setSearchParams({ step: String(step + 1) });
  // Retroceder
  const prev = () => setSearchParams({ step: String(step - 1) });

  // Redirigir a la acción final
  useEffect(() => {
    if (step === 6) {
      if (accion === "nueva") navigate("/dashboard/superadmin/asistencia/actions/create");
      else if (accion === "visualizar") navigate("/dashboard/superadmin/asistencia/actions/list");
    }
  }, [step, accion, navigate]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      {step === 1 && (
        <SelectSchoolStep
          value={colegioId}
          onChange={id => { setColegioId(id); setSearchParams({ step: "2" }); }}
        />
      )}
      {step === 2 && (
        <SelectUnitStep
          colegioId={colegioId}
          value={unidadId}
          onChange={id => { setUnidadId(id); setSearchParams({ step: "3" }); }}
        />
      )}
      {step === 3 && (
        <SelectCourseStep
          unidadId={unidadId}
          value={cursoId}
          onChange={id => { setCursoId(id); setSearchParams({ step: "4" }); }}
        />
      )}
      {step === 4 && (
        <SelectModeStep
          value={tipoAsistencia}
          onChange={tipo => { setTipoAsistencia(tipo); setSearchParams({ step: "5" }); }}
        />
      )}
      {step === 5 && (
        <SelectActionStep
          value={accion}
          onChange={accion => { setAccion(accion); setSearchParams({ step: "6" }); }}
        />
      )}
      <div className="flex justify-between mt-6">
        {step > 1 && step < 6 && (
          <button onClick={prev} className="px-4 py-2 bg-gray-200 rounded">Atrás</button>
        )}
        {step < 5 && (
          <button
            onClick={next}
            className="px-4 py-2 bg-blue-600 text-white rounded ml-auto"
            disabled={
              (step === 1 && !colegioId) ||
              (step === 2 && !unidadId) ||
              (step === 3 && !cursoId) ||
              (step === 4 && !tipoAsistencia) ||
              (step === 5 && !accion)
            }
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export default function AttendanceWizardPage() {
  return (
      <WizardSteps />
  );
}

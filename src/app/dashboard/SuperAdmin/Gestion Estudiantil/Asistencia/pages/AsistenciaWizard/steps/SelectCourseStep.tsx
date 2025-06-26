import CourseSelect from "../../../components/CourseSelect";

interface Props {
  unidadId?: number;
  value?: number;
  onChange: (id: number) => void;
  helperText?: string;
}

export default function SelectCourseStep({ unidadId, value, onChange, helperText }: Props) {
  return (
    <div>
      <label className="block mb-2 font-semibold">Seleccione un curso</label>
      {helperText && <div className="mb-2 text-sm text-gray-500">{helperText}</div>}
      <CourseSelect unidadId={unidadId} value={value} onChange={onChange} />
    </div>
  );
}

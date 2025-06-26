import { Outlet } from "react-router-dom";
import { AttendanceWizardProvider } from "../../context/AsistenciaWizardContext";

export default function AttendanceWizardLayout() {
  return (
    <AttendanceWizardProvider>
      <Outlet />
    </AttendanceWizardProvider>
  )
}
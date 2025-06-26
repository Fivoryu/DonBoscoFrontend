
import { Outlet } from "react-router-dom";
import TutorSidebar from "./TutorSidebar";

const TutorLayout = () => {
  return (
    <div className="flex min-h-screen">
      <TutorSidebar />
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TutorLayout;
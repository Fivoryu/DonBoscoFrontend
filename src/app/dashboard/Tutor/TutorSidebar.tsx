import { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { SIDEBAR_SECTIONS_TUTOR } from "../Sidebar/SidebarConfig";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function TutorSidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 h-screen bg-white shadow px-4 py-6">
      <h2 className="text-xl font-bold mb-6">Menú Tutor</h2>
      {SIDEBAR_SECTIONS_TUTOR.map((section) => (
        <div key={section.title} className="mb-4">
          <button
            onClick={() => toggleSection(section.title)}
            className="flex items-center justify-between w-full text-left font-medium"
          >
            {section.title}
            {expanded[section.title] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {expanded[section.title] && (
            <nav className="mt-2 flex flex-col space-y-1 pl-3">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "px-2 py-1 rounded hover:bg-gray-200",
                      isActive && "bg-gray-300 font-semibold"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      ))}
    </aside>
  );
}

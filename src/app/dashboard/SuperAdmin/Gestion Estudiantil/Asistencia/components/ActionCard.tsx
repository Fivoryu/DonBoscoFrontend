import React from "react";

interface ActionCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function ActionCard({ icon, title, description, onClick, selected }: ActionCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition shadow-sm ${selected ? "border-blue-600 bg-blue-50" : "hover:shadow-md"}`}
      onClick={onClick}
    >
      {icon && <div className="text-3xl text-blue-600">{icon}</div>}
      <div>
        <div className="font-bold text-lg">{title}</div>
        {description && <div className="text-gray-500 text-sm">{description}</div>}
      </div>
    </div>
  );
}

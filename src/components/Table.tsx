import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string; 
}

const Table = ({ children, className = ""}: TableProps) => {
  return (
    <div
      className={`overflow-auto max-w-full max-h-[70vh] border border-gray-300 rounded ${className}`}
      style={{ scrollbarWidth: "thin" /* Firefox */, scrollbarColor: "#888 #ddd" /* Firefox */ }}
    >
      <table className="min-w-full border-collapse border border-gray-300">
        {children}
      </table>
      <style>{`
        div::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        div::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-track {
          background: #ddd;
        }
      `}</style>
    </div>
  )
}

export default Table

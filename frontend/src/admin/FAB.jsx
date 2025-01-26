// Fab.jsx
import React from "react";
import { MdAdd } from "react-icons/md";

const Fab = ({ isOpen, toggleOptions, config, toggleCreateState }) => {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end gap-2">
      {/* Option buttons */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {config.map((item) => (
          <button
            key={item.id}
            className="rounded bg-teal-500 text-white shadow-lg flex items-center justify-center transition-transform duration-300 hover:bg-teal-600 px-3 py-2 whitespace-nowrap"
            onClick={() => toggleCreateState(item.id)}
          >
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB button */}
      <button
        className="w-14 h-14 rounded-full bg-purple-500 text-white shadow-lg flex items-center justify-center text-3xl transition-transform duration-300 hover:bg-purple-600 focus:outline-none"
        onClick={toggleOptions}
        style={{ transform: `rotate(${isOpen ? 135 : 0}deg)` }}
      >
        <MdAdd />
      </button>
    </div>
  );
};

export default Fab;

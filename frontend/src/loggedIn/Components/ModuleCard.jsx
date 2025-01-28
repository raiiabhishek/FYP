import React from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { FaFilePen } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

export default function ModuleCard({ module }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full cursor-pointer hover:underline ">
      <h1 className="text-xl font-bold mb-1">{module.name}</h1>
      <h2 className="text-gray-600 mb-3 text-sm">{module.course.name}</h2>
      <div className="flex gap-3 items-center">
        <FaFilePen
          className="cursor-pointer hover:text-blue-500"
          size={20}
          data-tooltip-id="assignment"
        />
        <Tooltip id="assignment" content="Assignments" place="right" />
        <AiOutlineBarChart
          className="cursor-pointer hover:text-blue-500"
          size={20}
          data-tooltip-id="result"
        />
        <Tooltip id="result" content="View Module Result" place="right" />
      </div>
    </div>
  );
}

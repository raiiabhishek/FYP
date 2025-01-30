import React, { useState } from "react";
import moment from "moment";
import "moment/locale/en-gb";
import Popup from "./Popup";

export default function TimeTableCards({ timetable }) {
  if (!timetable) {
    return <div className="text-gray-600">No timetable data available.</div>;
  }

  const { name, group, startDate, endDate, entries } = timetable;
  const formattedStartDate = moment(startDate)
    .locale("en-gb")
    .format("D MMM YYYY");
  const formattedEndDate = moment(endDate).locale("en-gb").format("D MMM YYYY");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-5 mb-4 transition-shadow hover:shadow-lg"
        onClick={openPopup}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <div className="text-gray-700">
          <p>
            <strong className="font-medium">Start Date:</strong>{" "}
            {formattedStartDate}
          </p>
          <p>
            <strong className="font-medium">End Date:</strong>{" "}
            {formattedEndDate}
          </p>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <div className="p-4 overflow-x-auto">
          {" "}
          {/* Added overflow-x-auto */}
          <h2 className="text-2xl font-bold mb-4">{name}</h2>
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            {" "}
            {/* Wrap info in a flex container */}
            <p>
              <strong className="font-medium">Start Date:</strong>{" "}
              {formattedStartDate}
            </p>
            <p>
              <strong className="font-medium">End Date:</strong>{" "}
              {formattedEndDate}
            </p>
            <p>
              <strong className="font-medium">Class Group:</strong> {group.name}
            </p>
          </div>
          <div className="mt-5 overflow-x-auto">
            {" "}
            {/* Wrapped the table in a scrollable container */}
            <table className="min-w-full divide-y divide-gray-200">
              {" "}
              {/* Added min-w-full */}
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Day
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Module
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teacher
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Classroom
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.dayOfWeek}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.startTime}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.endTime}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.module.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.teacher.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.classRoom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            onClick={closePopup}
          >
            Close
          </button>
        </div>
      </Popup>
    </>
  );
}

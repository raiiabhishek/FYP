import React, { useState, useEffect } from "react";
import axios from "axios";

const api = import.meta.env.VITE_URL;

function TTTable({ timetables }) {
  const [classGroups, setClassGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await axios.get(`${api}/groups/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setClassGroups(response.data.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }

    fetchGroups();
  }, []);

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdate = (id) => {
    console.log("Update clicked for ID:", id);
    // Implement your update logic here (e.g., open a modal, fetch data for editing)
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for ID:", id);
    // Implement your delete logic here (e.g., send a delete request)
  };

  const filteredTimetables = timetables.filter((timetable) => {
    const groupMatch = selectedGroup
      ? timetable.group.$oid === selectedGroup
      : true;
    const searchMatch = searchTerm
      ? timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timetable.entries.some(
          (entry) =>
            entry.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.classRoom.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    return groupMatch && searchMatch;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-4">
        <select
          className="border border-gray-300 p-2 rounded"
          value={selectedGroup}
          onChange={handleGroupChange}
        >
          <option value="">All Groups</option>
          {classGroups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Semester Name</th>
              <th className="py-2 px-4 border-b">Day</th>
              <th className="py-2 px-4 border-b">Start Time</th>
              <th className="py-2 px-4 border-b">End Time</th>
              <th className="py-2 px-4 border-b">Classroom</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimetables.map((timetable) =>
              timetable.entries.map((entry) => (
                <tr key={entry._id.$oid}>
                  <td className="py-2 px-4 border-b">{timetable.name}</td>
                  <td className="py-2 px-4 border-b">{entry.dayOfWeek}</td>
                  <td className="py-2 px-4 border-b">{entry.startTime}</td>
                  <td className="py-2 px-4 border-b">{entry.endTime}</td>
                  <td className="py-2 px-4 border-b">{entry.classRoom}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => handleUpdate(entry._id.$oid)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(entry._id.$oid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TTTable;

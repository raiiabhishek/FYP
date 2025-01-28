import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const GroupTable = ({ groups }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedFilterCourse, setSelectedFilterCourse] = useState("");
  const [localGroups, setLocalGroups] = useState(groups || []);
  const [filteredGroups, setFilteredGroups] = useState(groups || []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocalGroups(groups || []);
    setFilteredGroups(groups || []);
  }, [groups]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await axios.get(`${api}/courses/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCourseOptions(response.data.data);
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = localGroups;
    if (selectedFilterCourse) {
      filtered = filtered.filter(
        (group) => group.course.name === selectedFilterCourse
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((group) => {
        return group.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredGroups(filtered);
  }, [localGroups, selectedFilterCourse, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilterCourse(e.target.value);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Groups</h2>
      <div className="mb-4 flex items-center space-x-2">
        <div className="w-1/2">
          <label
            htmlFor="filterCourse"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Course:
          </label>
          <select
            id="filterCourse"
            className="mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 w-full"
            value={selectedFilterCourse}
            onChange={handleFilterChange}
          >
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course._id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="searchGroup"
            className="block text-sm font-medium text-gray-700"
          >
            Search Groups:
          </label>
          <input
            type="text"
            id="searchGroup"
            placeholder="Search groups..."
            className="mt-1 border p-2 rounded w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Course
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <tr key={group._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 py-2 px-4">
                  {group.name}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {group.course.name}
                </td>
              </tr>
            ))}
            {filteredGroups.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTable;

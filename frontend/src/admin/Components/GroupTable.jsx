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

  const handleEditClick = (group) => {
    setSelectedGroup(group);
    setEditGroupName(group.name);
    setEditCourseName(group.course.name);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage("");
    setSelectedGroup(null);
    setEditGroupName("");
    setEditCourseName("");
  };

  const handleFilterChange = (e) => {
    setSelectedFilterCourse(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.patch(
        `${api}/groups/edit/${selectedGroup._id}`,
        { name: editGroupName, course: editCourseName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.status === "success") {
        setMessage("Group Updated Successfully!");
        //Update local state
        setLocalGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id === selectedGroup._id
              ? {
                  ...group,
                  name: editGroupName,
                  course: { name: editCourseName },
                }
              : group
          )
        );
        setFilteredGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id === selectedGroup._id
              ? {
                  ...group,
                  name: editGroupName,
                  course: { name: editCourseName },
                }
              : group
          )
        );
        handleCloseModal();
      } else {
        setMessage(response.data.message || "Failed to update group");
      }
    } catch (error) {
      setMessage(`Error updating group: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.delete(`${api}/groups/delete/${groupId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.status === "success") {
        setMessage("Group Deleted Successfully");
        setLocalGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        setFilteredGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
      } else {
        setMessage("Failed to delete group");
      }
    } catch (error) {
      setMessage(`Error deleting group: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Course
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <tr key={group._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{group.name}</td>
                <td className="py-2 px-4">{group.course.name}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(group)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Group
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editGroupName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group Name:
                </label>
                <input
                  type="text"
                  id="editGroupName"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editCourseName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="editCourseName"
                  value={editCourseName}
                  onChange={(e) => setEditCourseName(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a Course
                  </option>
                  {courseOptions?.length > 0 &&
                    courseOptions.map((courseOption) => (
                      <option key={courseOption._id} value={courseOption.name}>
                        {courseOption.name}
                      </option>
                    ))}
                </select>
              </div>
              {message && (
                <div
                  className={`mt-2 p-2 rounded-md  ${
                    message.startsWith("Group Updated Successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-200 focus:outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Group"}
                </button>
              </div>
              <button
                onClick={handleCloseModal}
                type="button"
                className="mt-4 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupTable;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const ModuleTable = ({ modules }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [editModuleName, setEditModuleName] = useState("");
  const [editModuleDescription, setEditModuleDescription] = useState("");
  const [editModuleCredit, setEditModuleCredit] = useState("");
  const [editModuleCourse, setEditModuleCourse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedFilterCourse, setSelectedFilterCourse] = useState("");
  const [localModules, setLocalModules] = useState(modules || []);
  const [filteredModules, setFilteredModules] = useState(modules || []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocalModules(modules || []);
    setFilteredModules(modules || []);
  }, [modules]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get(`${api}/courses/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCourseOptions(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = localModules;

    if (selectedFilterCourse) {
      filtered = filtered.filter(
        (module) => module.course.name === selectedFilterCourse
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((module) => {
        return (
          module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredModules(filtered);
  }, [localModules, selectedFilterCourse, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (module) => {
    setSelectedModule(module);
    setEditModuleName(module.name);
    setEditModuleDescription(module.description);
    setEditModuleCredit(module.credit);
    setEditModuleCourse(module.course.name);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setSelectedFilterCourse(e.target.value);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage("");
    setSelectedModule(null);
    setEditModuleName("");
    setEditModuleDescription("");
    setEditModuleCredit("");
    setEditModuleCourse("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.patch(
        `${api}/modules/edit/${selectedModule._id}`,
        {
          name: editModuleName,
          description: editModuleDescription,
          credit: editModuleCredit,
          course: editModuleCourse,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Module Updated Successfully!");
        setLocalModules((prevModules) =>
          prevModules.map((module) =>
            module._id === selectedModule._id
              ? {
                  ...module,
                  name: editModuleName,
                  description: editModuleDescription,
                  credit: editModuleCredit,
                  course: { name: editModuleCourse },
                }
              : module
          )
        );
        setFilteredModules((prevModules) =>
          prevModules.map((module) =>
            module._id === selectedModule._id
              ? {
                  ...module,
                  name: editModuleName,
                  description: editModuleDescription,
                  credit: editModuleCredit,
                  course: { name: editModuleCourse },
                }
              : module
          )
        );
        handleCloseModal();
      } else {
        setMessage(response.data.message || "Failed to update module");
      }
    } catch (error) {
      setMessage(`Error updating module: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (moduleId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(`${api}/modules/delete/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status === "success") {
        setMessage("Module Deleted Successfully");
        setLocalModules((prevModules) =>
          prevModules.filter((module) => module._id !== moduleId)
        );
        setFilteredModules((prevModules) =>
          prevModules.filter((module) => module._id !== moduleId)
        );
      } else {
        setMessage("Failed to delete module");
      }
    } catch (error) {
      setMessage(`Error deleting module: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Modules</h2>
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
            {courseOptions?.length > 0 &&
              courseOptions.map((course) => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
          </select>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="searchModules"
            className="block text-sm font-medium text-gray-700"
          >
            Search Modules:
          </label>
          <input
            type="text"
            id="searchModules"
            placeholder="Search modules..."
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
                Description
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Credit
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
            {filteredModules.map((module) => (
              <tr key={module._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{module.name}</td>
                <td className="py-2 px-4">{module.description}</td>
                <td className="py-2 px-4">{module.credit}</td>
                <td className="py-2 px-4">{module.course?.name}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(module)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(module._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredModules.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No modules found.
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
              Edit Module
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editModuleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Module Name:
                </label>
                <input
                  type="text"
                  id="editModuleName"
                  value={editModuleName}
                  onChange={(e) => setEditModuleName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter module name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editModuleDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description:
                </label>
                <textarea
                  id="editModuleDescription"
                  value={editModuleDescription}
                  onChange={(e) => setEditModuleDescription(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter module description"
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="editModuleCredit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credit:
                </label>
                <input
                  type="number"
                  id="editModuleCredit"
                  value={editModuleCredit}
                  onChange={(e) => setEditModuleCredit(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter module credit"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editModuleCourse"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="editModuleCourse"
                  value={editModuleCourse}
                  onChange={(e) => setEditModuleCourse(e.target.value)}
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
                    message.startsWith("Module Updated Successfully")
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
                  {loading ? "Updating..." : "Update Module"}
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

export default ModuleTable;

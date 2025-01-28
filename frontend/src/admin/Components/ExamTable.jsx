import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";
import moment from "moment";

const ExamTable = ({ exams }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [editExamName, setEditExamName] = useState("");
  const [editExamDate, setEditExamDate] = useState("");
  const [editModule, setEditModule] = useState("");
  const [message, setMessage] = useState({ text: "", type: null });
  const [loading, setLoading] = useState(false);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [selectedFilterModule, setSelectedFilterModule] = useState("");
  const [localExams, setLocalExams] = useState(exams || []);
  const [filteredExams, setFilteredExams] = useState(exams || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setLocalExams(exams || []);
    setFilteredExams(exams || []);
  }, [exams]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${api}/modules/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setModuleOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setMessage({
          text: `Error fetching modules: ${error.message}`,
          type: "error",
        });
      }
    };

    fetchModules();
  }, []);
  useEffect(() => {
    let filtered = localExams;

    if (selectedFilterModule) {
      filtered = filtered.filter(
        (exam) => exam.module._id === selectedFilterModule
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((exam) => {
        return exam.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    setFilteredExams(filtered);
  }, [localExams, selectedFilterModule, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleEditClick = (exam) => {
    setSelectedExam(exam);
    setEditExamName(exam.name);
    setEditExamDate(moment(exam.examDate).format("YYYY-MM-DDTHH:mm"));
    setEditModule(exam.module._id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (exam) => {
    setSelectedExam(exam);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedExam(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage({ text: "", type: null });
    setSelectedExam(null);
    setEditExamName("");
    setEditExamDate("");
    setEditModule("");
  };
  const handleFilterChange = (e) => {
    setSelectedFilterModule(e.target.value);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: null });

    try {
      const response = await axios.patch(
        `${api}/exams/edit/${selectedExam._id}`,
        {
          name: editExamName,
          examDate: editExamDate,
          module: editModule,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage({ text: "Exam Updated Successfully!", type: "success" });
        setLocalExams((prevExams) =>
          prevExams.map((exam) =>
            exam._id === selectedExam._id
              ? {
                  ...exam,
                  name: editExamName,
                  examDate: editExamDate,
                  module: moduleOptions.find(
                    (module) => module._id === editModule
                  ),
                }
              : exam
          )
        );
        setFilteredExams((prevExams) =>
          prevExams.map((exam) =>
            exam._id === selectedExam._id
              ? {
                  ...exam,
                  name: editExamName,
                  examDate: editExamDate,
                  module: moduleOptions.find(
                    (module) => module._id === editModule
                  ),
                }
              : exam
          )
        );
        handleCloseModal();
      } else {
        setMessage({
          text: response.data.message || "Failed to update exam",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: `Error updating exam: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage({ text: "", type: null });
    try {
      const response = await axios.delete(
        `${api}/exams/delete/${selectedExam._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage({ text: "Exam Deleted Successfully", type: "success" });
        setLocalExams((prevExams) =>
          prevExams.filter((exam) => exam._id !== selectedExam._id)
        );
        setFilteredExams((prevExams) =>
          prevExams.filter((exam) => exam._id !== selectedExam._id)
        );
        handleCloseDeleteModal();
      } else {
        setMessage({
          text: response.data.message || "Failed to delete exam",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: `Error deleting exam: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Exams</h2>
      <div className="mb-4 flex items-center space-x-2">
        <div className="w-1/2">
          <label
            htmlFor="filterModule"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Module:
          </label>
          <select
            id="filterModule"
            className="mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 w-full"
            value={selectedFilterModule}
            onChange={handleFilterChange}
          >
            <option value="">All Modules</option>
            {moduleOptions?.length > 0 &&
              moduleOptions.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.name}
                </option>
              ))}
          </select>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="searchExams"
            className="block text-sm font-medium text-gray-700"
          >
            Search Exams:
          </label>
          <input
            type="text"
            id="searchExams"
            placeholder="Search exams..."
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
                Module
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Exam Date
              </th>
              <th className="border border-gray-300 py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 py-2 px-4">
                  {exam.name}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {exam.module?.name}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {moment(exam.examDate).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(exam)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(exam)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredExams.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No exams found.
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
              Edit Exam
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editExamName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Exam Name:
                </label>
                <input
                  type="text"
                  id="editExamName"
                  value={editExamName}
                  onChange={(e) => setEditExamName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter exam name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editExamDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Exam Date:
                </label>
                <input
                  type="datetime-local"
                  id="editExamDate"
                  value={editExamDate}
                  onChange={(e) => setEditExamDate(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter exam date"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editModule"
                  className="block text-sm font-medium text-gray-700"
                >
                  Module:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="editModule"
                  value={editModule}
                  onChange={(e) => setEditModule(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a Module
                  </option>
                  {moduleOptions?.length > 0 &&
                    moduleOptions.map((module) => (
                      <option key={module._id} value={module._id}>
                        {module.name}
                      </option>
                    ))}
                </select>
              </div>
              {message.text && (
                <div
                  className={`mt-2 p-2 rounded-md  ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
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
                  {loading ? "Updating..." : "Update Exam"}
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
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Delete Exam
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold"> {selectedExam?.name} </span>?
            </p>
            {message.text && (
              <div
                className={`mt-2 p-2 rounded-md  ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className={`py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring focus:ring-red-200 focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={handleCloseDeleteModal}
                type="button"
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTable;

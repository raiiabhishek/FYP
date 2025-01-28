import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const CreateExamForm = ({ toggleCreateState }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  // Accept api and course as props
  const [moduleOptions, setModuleOptions] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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
  }, []); // Re-run effect when api or course changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        `${api}/exams/create`,
        {
          // Use the passed api prop
          module: selectedModule,
          examDate,
          name: examName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage({
        text: response.data.message || "Exam created successfully!",
        type: "success",
      });
      // Reset the form
      setSelectedModule("");
      setExamDate("");
      setExamName("");
      toggleCreateState("exam");
    } catch (error) {
      console.error("Error creating exam:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to create exam.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Exam</h2>
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="module"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Module
          </label>
          <select
            id="module"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select a Module
            </option>
            {moduleOptions.map((module) => (
              <option key={module._id} value={module.name}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="examDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Exam Date
          </label>
          <input
            type="datetime-local"
            id="examDate"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="examName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Exam Name
          </label>
          <input
            type="text"
            id="examName"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Exam"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExamForm;

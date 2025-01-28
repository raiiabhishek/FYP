import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../AuthContext";
import axios from "axios";
const CreateGroupForm = ({ toggleCreateState }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post(
        `${api}/groups/create`,
        { name: groupName, course: courseName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Group Created Successfully!");
        // Clear form after successful submission
        setGroupName("");
        setCourseName("");
        toggleCreateState("group");
      } else {
        setMessage(data.message || "Failed to create group");
      }
    } catch (error) {
      setMessage(`Error Creating group: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Group
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              Group Name:
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              placeholder="Enter group name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="courseName"
              className="block text-sm font-medium text-gray-700"
            >
              Course:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Course
              </option>{" "}
              {/* Placeholder option */}
              {courseOptions?.length > 0 &&
                courseOptions.map((courseOption) => (
                  <option key={courseOption} value={courseOption.name}>
                    {courseOption.name}
                  </option>
                ))}
            </select>
          </div>

          {message && (
            <div
              className={`mt-2 p-2 rounded-md  ${
                message.startsWith("Group Created Successfully")
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
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;

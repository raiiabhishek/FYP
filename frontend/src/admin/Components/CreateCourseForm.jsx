import React, { useContext, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CreateCourseForm = ({ toggleCreateState }) => {
  console.log("toggleCreateState prop:", toggleCreateState);
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post(
        `${api}/courses/create`,
        { name, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccess(true);
      setMessage("Course Created Successfully!");
      setName("");
      setDescription("");
      if (response.data.status === "success") {
        alert("Course Created Successfully!");
        toggleCreateState("course");
      } else {
        setMessage("Failed to create course. Please try again.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setMessage("Failed to create course. An error occurred.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create New Course
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Course Name
            </label>
            <input
              className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter Course Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Enter Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 p-2 rounded text-center ${
                success
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;

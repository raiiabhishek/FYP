import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import axios from "axios";
export default function CreateAnnouncementForm({ toggleCreateState }) {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  useEffect(() => {
    async function fetchCourses() {
      const response = await axios.get(`${api}/courses/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setCourseOptions(response.data.data);
    }
    fetchCourses();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${api}/announcements/create`,
        { name, description, course },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccess(true);
      setMessage("Announcement Created Successfully!");
      setName("");
      setDescription("");
      setCourse("");
      toggleCreateState("announcement");
    } catch (error) {
      console.error("Error creating announcement:", error);
      setMessage("Failed to create announcement. An error occurred.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create New Announcement
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Announcement Name
            </label>
            <input
              className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter Announcement Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="course"
            >
              Course
            </label>
            <select
              className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
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
              placeholder="Enter Announcement Description"
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
              {loading ? "Creating..." : "Create Announcement"}
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
}

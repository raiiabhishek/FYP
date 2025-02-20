import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import axios from "axios";
export default function CertificatesTable({ courses }) {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [localCourses, setLocalCourses] = useState(courses || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses || []);

  useEffect(() => {
    setLocalCourses(courses || []);
    setFilteredCourses(courses || []);
  }, [courses]);

  useEffect(() => {
    const filtered = localCourses.filter((course) => {
      return (
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredCourses(filtered);
  }, [searchTerm, localCourses]);

  const handlePublishCertificate = async (courseId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${api}/certificates/create`,
        { courseId: courseId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Certificates Published Successfully!");
      } else {
        setMessage(response.data.message || "Failed to publish certificates");
      }
    } catch (error) {
      setMessage(`Error publishing certificates: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className="border border-gray-300 py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 py-2 px-4">
                  {course.name}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {course.description}
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  <button
                    onClick={() => handlePublishCertificate(course._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    disabled={loading}
                  >
                    {loading ? "Publishing..." : "Publish Certificates"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {message && (
        <div
          className={`mt-2 p-2 rounded-md  ${
            message.startsWith("Certificates Published Successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

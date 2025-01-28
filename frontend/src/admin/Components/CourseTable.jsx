import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const CourseTable = ({ courses }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourseName, setEditCourseName] = useState("");
  const [editCourseDescription, setEditCourseDescription] = useState("");
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

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setEditCourseName(course.name);
    setEditCourseDescription(course.description);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage("");
    setSelectedCourse(null);
    setEditCourseName("");
    setEditCourseDescription("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.patch(
        `${api}/courses/edit/${selectedCourse._id}`,
        { name: editCourseName, description: editCourseDescription },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Course Updated Successfully!");
        setLocalCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === selectedCourse._id
              ? {
                  ...course,
                  name: editCourseName,
                  description: editCourseDescription,
                }
              : course
          )
        );

        handleCloseModal();
      } else {
        setMessage(response.data.message || "Failed to update course");
      }
    } catch (error) {
      setMessage(`Error updating course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(`${api}/courses/delete/${courseId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status === "success") {
        setMessage("Course Deleted Successfully");
        setLocalCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
      } else {
        setMessage("Failed to delete course");
      }
    } catch (error) {
      setMessage(`Error deleting course: ${error.message}`);
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
              <th className=" border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className=" border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className=" border border-gray-300 py-3 px-4 text-center font-semibold text-gray-700">
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
                <td className="border border-gray-300 py-2 px-4 text-center space-y-2">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded  w-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-full"
                  >
                    Delete
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Course
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editCourseName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course Name:
                </label>
                <input
                  type="text"
                  id="editCourseName"
                  value={editCourseName}
                  onChange={(e) => setEditCourseName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter course name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editCourseDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description:
                </label>
                <textarea
                  id="editCourseDescription"
                  value={editCourseDescription}
                  onChange={(e) => setEditCourseDescription(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter course description"
                  required
                ></textarea>
              </div>
              {message && (
                <div
                  className={`mt-2 p-2 rounded-md  ${
                    message.startsWith("Course Updated Successfully")
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
                  {loading ? "Updating..." : "Update Course"}
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

export default CourseTable;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const TeacherTable = ({ teachers, setTeachers }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedFilterCourse, setSelectedFilterCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState(teachers || []);
  const [localTeachers, setLocalTeachers] = useState(teachers || []);

  useEffect(() => {
    setLocalTeachers(teachers || []);
    setFilteredTeachers(teachers || []);
  }, [teachers]);

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

  const handleFilterChange = (e) => {
    const selectedCourse = e.target.value;
    setSelectedFilterCourse(selectedCourse);

    if (!selectedCourse) {
      setFilteredTeachers(localTeachers);
    } else {
      const filtered = localTeachers.filter(
        (teacher) => teacher.course.name === selectedCourse
      );
      setFilteredTeachers(filtered);
    }
  };
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const searchFiltered = localTeachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.email.toLowerCase().includes(query.toLowerCase()) ||
        teacher.phone.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTeachers(searchFiltered);
  };

  const handleKickTeacher = async (teacherId) => {
    try {
      // Make an API call to remove the teacher
      await axios.delete(`${api}/teachers/delete/${teacherId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setLocalTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher._id !== teacherId)
      );
      setFilteredTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher._id !== teacherId)
      );
      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
    } catch (err) {
      console.error("Error kicking teacher:", err);
      alert("Error kicking teacher.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Teachers</h2>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <label
            htmlFor="filterCourse"
            className="block text-sm font-medium text-gray-700 mr-2"
          >
            Filter by Course:
          </label>
          <select
            id="filterCourse"
            className="mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 w-full max-w-sm"
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
        <div className="flex items-center">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mr-2"
          >
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 w-full max-w-sm"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search teachers..."
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Course</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.course.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleKickTeacher(teacher._id)}
                  >
                    Kick
                  </button>
                </td>
              </tr>
            ))}
            {filteredTeachers.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTable;

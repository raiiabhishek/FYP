import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const StudentTable = ({ students, setStudents }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedFilterCourse, setSelectedFilterCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students || []);
  const [localStudents, setLocalStudents] = useState(students || []);

  useEffect(() => {
    setLocalStudents(students || []);
    setFilteredStudents(students || []);
  }, [students]);

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
      setFilteredStudents(localStudents);
    } else {
      const filtered = localStudents.filter(
        (student) => student.course.name === selectedCourse
      );
      setFilteredStudents(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const searchFiltered = localStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase()) ||
        student.phone.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(searchFiltered);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
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
            placeholder="Search students..."
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
              <th className="border border-gray-300 px-4 py-2">Group</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {student.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.course.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.groups.map((group, index) => (
                    <p key={index}>{group.name}</p>
                  ))}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;

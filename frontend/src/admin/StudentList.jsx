import React, { useState, useEffect } from "react";
import TeacherTable from "./Components/TeacherTable";
import axios from "axios";
import StudentTable from "./Components/StudentTable";
export default function StudentList() {
  const api = import.meta.env.VITE_URL;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${api}/students`);

        setStudents(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching students.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <StudentTable students={students} setStudents={setStudents} />
      </div>
    </div>
  );
}

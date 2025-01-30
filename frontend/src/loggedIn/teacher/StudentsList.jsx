import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../Components/SideBar";
import StudentTable from "../Components/StudentTable";
import { AuthContext } from "../../../AuthContext";
export default function StudentList() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${api}/students/teacher`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response);
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
    <div className="min-h-screen">
      <div className="lg:flex">
        <Sidebar />
        <div className="p-4 lg:p-8 mt-17 lg:mt-0">
          <StudentTable students={students} setStudents={setStudents} />
        </div>
      </div>
    </div>
  );
}

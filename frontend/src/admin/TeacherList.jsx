import React, { useState, useEffect } from "react";
import TeacherTable from "./Components/TeacherTable";
import axios from "axios";
export default function TeacherList() {
  const api = import.meta.env.VITE_URL;
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${api}/teachers`);

        setTeachers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching teachers.");
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading teachers...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <TeacherTable teachers={teachers} setTeachers={setTeachers} />
      </div>
    </div>
  );
}

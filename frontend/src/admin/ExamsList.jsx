import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseTable from "./Components/CourseTable";
import ExamTable from "./Components/ExamTable";
export default function ExamsList() {
  const api = import.meta.env.VITE_URL;
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${api}/exams`);

        setExams(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching exams.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading exams...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <ExamTable exams={exams} setExams={setExams} />
      </div>
    </div>
  );
}

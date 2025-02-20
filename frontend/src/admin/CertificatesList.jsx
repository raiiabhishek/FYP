import React, { useState, useEffect } from "react";
import axios from "axios";
import CertificatesTable from "./Components/CertificatesTable";
export default function CertificatesList() {
  const api = import.meta.env.VITE_URL;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${api}/courses`);

        setCourses(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <CertificatesTable courses={courses} setCourses={setCourses} />
      </div>
    </div>
  );
}

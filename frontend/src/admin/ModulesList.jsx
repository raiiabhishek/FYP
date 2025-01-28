import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseTable from "./Components/CourseTable";
import ModuleTable from "./Components/ModuleTable";
export default function ModulesList() {
  const api = import.meta.env.VITE_URL;
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${api}/modules`);

        setModules(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching modules.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading modules...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <ModuleTable modules={modules} setModules={setModules} />
      </div>
    </div>
  );
}

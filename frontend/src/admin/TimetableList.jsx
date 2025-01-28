import React, { useState, useEffect } from "react";
import axios from "axios";
import TTTable from "./Components/TTTable";
export default function TimetableList() {
  const api = import.meta.env.VITE_URL;
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(`${api}/timetables`);

        setTimetables(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching timetables.");
        setLoading(false);
      }
    };

    fetchTimetables();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading timetables...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <TTTable timetables={timetables} setTimetables={setTimetables} />
      </div>
    </div>
  );
}

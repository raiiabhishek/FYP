import React, { useContext, useState, useEffect } from "react";
import TimeTableCards from "../Components/TimeTableCards";
import { AuthContext } from "../../../AuthContext";
import axios from "axios";
import Sidebar from "../Components/SideBar";
export default function TimetableList() {
  const api = import.meta.env.VITE_URL;
  const { authToken, role } = useContext(AuthContext);
  let url = `${api}/timetables/student`;
  if (role === "teacher") url = `${api}/timetables/teacher`;
  const [timetables, setTimetables] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchTimetable() {
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setTimetables(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching students.");
        setLoading(false);
      }
    }
    fetchTimetable();
  }, []);
  if (loading) {
    return <div className="text-center mt-4">Loading timetables...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div className="min-h-screen">
      <div className="lg:flex">
        <Sidebar />
        <div className="p-4 lg:p-8 w-full space-y-5  ">
          <h1 className="text-2xl font-bold">Timetables</h1>
          <div className="flex flex-wrap gap-3">
            {timetables.length > 0
              ? timetables.map((timetable) => (
                  <div key={timetable._id} className="w-full sm:w-1/2 lg:w-1/3">
                    <TimeTableCards timetable={timetable} />
                  </div>
                ))
              : "No timetables found"}
          </div>
        </div>
      </div>
    </div>
  );
}

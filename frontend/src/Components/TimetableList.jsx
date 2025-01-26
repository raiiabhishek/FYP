// components/TimetableList.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const TimetableList = () => {
  const [timetables, setTimetables] = useState([]);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await axios.get("/api/timetables");
        setTimetables(res.data);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      }
    };

    fetchTimetables();
  }, []);

  return (
    <div>
      <h2>Timetables</h2>
      {timetables.map((timetable) => (
        <div key={timetable._id}>
          <h3>{timetable.name}</h3>
          <p>{timetable.description}</p>
          {/* Display timetable entries, handle formatting etc */}
          {timetable.entries && timetable.entries.length > 0 && (
            <div>
              {timetable.entries.map((entry, index) => (
                <div key={index}>
                  <p>Day: {entry.dayOfWeek}</p>
                  <p>
                    Time: {entry.startTime} - {entry.endTime}
                  </p>
                  <p>Subject: {entry.subject}</p>
                  <p>
                    Teacher: {entry.teacher ? entry.teacher.name : "N/A"}
                  </p>{" "}
                  {/* Example of referencing a field from a referenced model */}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TimetableList;

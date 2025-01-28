import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupTable from "./Components/GroupTable";
export default function GroupsList() {
  const api = import.meta.env.VITE_URL;
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${api}/groups`);

        setGroups(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching groups.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading groups...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <GroupTable groups={groups} setGroups={setGroups} />
      </div>
    </div>
  );
}

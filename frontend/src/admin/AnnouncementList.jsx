import React, { useState, useEffect } from "react";
import axios from "axios";
import AnnouncementTable from "./Components/AnnouncementTable";
export default function AnnouncementList() {
  const api = import.meta.env.VITE_URL;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${api}/announcements/`);
        console.log(response);
        setAnnouncements(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching announcements."
        );
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading announcements...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <AnnouncementTable
          announcements={announcements}
          setAnnouncements={setAnnouncements}
        />
      </div>
    </div>
  );
}

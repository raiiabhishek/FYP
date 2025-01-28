import React, { useState, useEffect } from "react";
import axios from "axios";
import EventTable from "./Components/EventTable";
export default function EventsList() {
  const api = import.meta.env.VITE_URL;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${api}/events`);

        setEvents(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }
  return (
    <div>
      <div className="md:flex">
        <EventTable events={events} setEvents={setEvents} />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import CalendarView from "./Components/CalendarView";
import Chart from "./Components/Chart";
import UserGrowth from "./Components/UserGrowth";
import { AuthContext } from "../../AuthContext";
import EventCard from "../loggedIn/Components/EventCard";
import AnnouncementCard from "../loggedIn/Components/AnnouncementCard";
import axios from "axios";
export default function Dashboard() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const handleCalendar = () => {
    setCalendarOpen(!calendarOpen);
  };
  useEffect(() => {
    const fetchAnnouncement = async () => {
      const response = await axios.get(`${api}/announcements`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setAnnouncements(response.data.data);
    };

    fetchAnnouncement();
    const fetchEvents = async () => {
      const response = await axios.get(`${api}/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEvents(response.data.data);
    };

    fetchEvents();
  }, []);
  return (
    <div className="lg:flex justify-between gap-5">
      <div className={`w-2/3 ${calendarOpen ? "hidden" : ""} `}>
        <Chart />
        <UserGrowth />
      </div>
      {calendarOpen && (
        <div className="flex-1 p-4 lg:p-8 flex flex-col">
          <CalendarView />
        </div>
      )}
      <div className="flex flex-col ">
        <button
          className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCalendar}
        >
          {calendarOpen ? "Close Calendar" : "View Calendar"}
        </button>
        <div className="h-1/2 overflow-y-auto p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold mb-4">Announcements</h1>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <AnnouncementCard
                announcement={announcement}
                key={announcement._id}
              />
            ))
          ) : (
            <p>No announcements found.</p>
          )}
        </div>
        <div className="h-1/2 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Events</h1>
          {events.length > 0 ? (
            events.map((event) => <EventCard event={event} key={event._id} />)
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

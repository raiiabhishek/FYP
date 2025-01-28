import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/SideBar";
import { AuthContext } from "../../../AuthContext";

export default function StudentHome() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${api}/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setProfile(response.data.data);
        setModules(response.data.modules);
        setAnnouncements(response.data.announcements);
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching dashboard.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken, api]);

  useEffect(() => {
    setFilteredModules(
      modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [modules, searchQuery]);

  const handleSearchClick = () => {
    setFilteredModules(
      modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };
  const handleCalendar = () => {
    setCalendarOpen(!calendarOpen);
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return <div>Error:{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="lg:flex">
        <Sidebar />

        <div
          className={`flex-1 p-4 lg:p-8 flex flex-col transition-all duration-300 ${
            calendarOpen ? "hidden" : ""
          }`}
        >
          <div className="flex items-center mb-4 ">
            <div className="flex flex-grow items-center justify-between">
              <h1 className="text-2xl font-bold">Modules</h1>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search Modules..."
                  className="border p-2 rounded-l flex-grow focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchClick();
                    }
                  }}
                  style={{ height: "40px" }}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded-r flex items-center justify-center"
                  onClick={handleSearchClick}
                  style={{ height: "40px" }}
                >
                  <IoSearch className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[600px] lg:max-h-[800px] pr-2 ">
            {filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredModules.map((module) => (
                  <ModuleCard module={module} key={module._id} />
                ))}
              </div>
            ) : (
              <p>No modules match your search.</p>
            )}
          </div>
        </div>
        {calendarOpen && (
          <div className="flex-1 p-4 lg:p-8 flex flex-col">
            <CalendarView course={profile.course.name} />
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
    </div>
  );
}

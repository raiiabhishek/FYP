import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";
import moment from "moment";

const EventTable = ({ events }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [message, setMessage] = useState({ text: "", type: null });
  const [loading, setLoading] = useState(false);
  const [localEvents, setLocalEvents] = useState(events || []);
  const [filteredEvents, setFilteredEvents] = useState(events || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");

  useEffect(() => {
    setLocalEvents(events || []);
    setFilteredEvents(events || []);
  }, [events]);

  useEffect(() => {
    let filtered = localEvents;

    if (filterStartDate) {
      filtered = filtered.filter((event) => {
        const eventStartDate = moment(event.startDate).startOf("day"); // Use event's start date and take only date part for filtering
        const filterDate = moment(filterStartDate).startOf("day"); // Take only date part from the filter

        return eventStartDate.isSame(filterDate);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [localEvents, filterStartDate, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditStartDate(moment(event.startDate).format("YYYY-MM-DD"));
    setEditEndDate(moment(event.endDate).format("YYYY-MM-DD"));
    setEditStartTime(event.startTime);
    setEditEndTime(event.endTime);
    setEditLocation(event.location);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage({ text: "", type: null });
    setSelectedEvent(null);
    setEditTitle("");
    setEditDescription("");
    setEditStartDate("");
    setEditEndDate("");
    setEditStartTime("");
    setEditEndTime("");
    setEditLocation("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: null });

    try {
      const response = await axios.patch(
        `${api}/events/edit/${selectedEvent._id}`,
        {
          title: editTitle,
          description: editDescription,
          startDate: editStartDate,
          endDate: editEndDate,
          startTime: editStartTime,
          endTime: editEndTime,
          location: editLocation,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage({ text: "Event Updated Successfully!", type: "success" });
        setLocalEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === selectedEvent._id
              ? {
                  ...event,
                  title: editTitle,
                  description: editDescription,
                  startDate: editStartDate,
                  endDate: editEndDate,
                  startTime: editStartTime,
                  endTime: editEndTime,
                  location: editLocation,
                }
              : event
          )
        );
        setFilteredEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === selectedEvent._id
              ? {
                  ...event,
                  title: editTitle,
                  description: editDescription,
                  startDate: editStartDate,
                  endDate: editEndDate,
                  startTime: editStartTime,
                  endTime: editEndTime,
                  location: editLocation,
                }
              : event
          )
        );
        handleCloseModal();
      } else {
        setMessage({
          text: response.data.message || "Failed to update event",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: `Error updating event: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage({ text: "", type: null });
    try {
      const response = await axios.delete(
        `${api}/events/delete/${selectedEvent._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage({ text: "Event Deleted Successfully", type: "success" });
        setLocalEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== selectedEvent._id)
        );
        setFilteredEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== selectedEvent._id)
        );
        handleCloseDeleteModal();
      } else {
        setMessage({
          text: response.data.message || "Failed to delete event",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: `Error deleting event: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <div className="mb-4 flex items-center space-x-2">
        <div className="w-1/2">
          <label
            htmlFor="filterStartDate"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Start Date:
          </label>
          <input
            type="date"
            id="filterStartDate"
            className="mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 w-full"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>

        <div className="w-1/2">
          <label
            htmlFor="searchEvents"
            className="block text-sm font-medium text-gray-700"
          >
            Search Events:
          </label>
          <input
            type="text"
            id="searchEvents"
            placeholder="Search events..."
            className="mt-1 border p-2 rounded w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Start Date
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                End Date
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Start Time
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                End Time
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Location
              </th>
              <th className="border border-gray-300 py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 py-2 px-4">
                  {event.title}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {event.description}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {moment(event.startDate).format("YYYY-MM-DD")}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {moment(event.endDate).format("YYYY-MM-DD")}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {event.startTime}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {event.endTime}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {event.location}
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(event)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(event)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Event
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title:
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Description:
                </label>
                <input
                  type="text"
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter event description"
                  required
                />
              </div>
              <div className="md:flex gap-2">
                <div className="w-full">
                  <label
                    htmlFor="editStartDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="editStartDate"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="Enter start date"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="editEndDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="editEndDate"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="Enter end date"
                    required
                  />
                </div>
              </div>
              <div className="md:flex gap-2">
                <div className="w-full">
                  <label
                    htmlFor="editStartTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time:
                  </label>
                  <input
                    type="time"
                    id="editStartTime"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="Enter start time"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="editEndTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time:
                  </label>
                  <input
                    type="time"
                    id="editEndTime"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="Enter end time"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="editLocation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location:
                </label>
                <input
                  type="text"
                  id="editLocation"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter event location"
                  required
                />
              </div>
              {message.text && (
                <div
                  className={`mt-2 p-2 rounded-md  ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-200 focus:outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Event"}
                </button>
              </div>
              <button
                onClick={handleCloseModal}
                type="button"
                className="mt-4 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Delete Event
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold"> {selectedEvent?.title} </span>?
            </p>
            {message.text && (
              <div
                className={`mt-2 p-2 rounded-md  ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className={`py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring focus:ring-red-200 focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={handleCloseDeleteModal}
                type="button"
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTable;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const AnnouncementTable = ({ announcements }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [editAnnouncementName, setEditAnnouncementName] = useState("");
  const [editAnnouncementDescription, setEditAnnouncementDescription] =
    useState("");
  const [editAnnouncementCourse, setEditAnnouncementCourse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedFilterCourse, setSelectedFilterCourse] = useState("");
  const [localAnnouncements, setLocalAnnouncements] = useState(
    announcements || []
  );
  const [filteredAnnouncements, setFilteredAnnouncements] = useState(
    announcements || []
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocalAnnouncements(announcements || []);
    setFilteredAnnouncements(announcements || []);
  }, [announcements]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get(`${api}/courses/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCourseOptions(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = localAnnouncements;

    if (selectedFilterCourse) {
      filtered = filtered.filter(
        (announcement) => announcement.course?.name === selectedFilterCourse
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((announcement) => {
        return (
          announcement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredAnnouncements(filtered);
  }, [localAnnouncements, selectedFilterCourse, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditAnnouncementName(announcement.name);
    setEditAnnouncementDescription(announcement.description);
    setEditAnnouncementCourse(announcement.course?.name);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setSelectedFilterCourse(e.target.value);
  };
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setMessage("");
    setSelectedAnnouncement(null);
    setEditAnnouncementName("");
    setEditAnnouncementDescription("");
    setEditAnnouncementCourse("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.patch(
        `${api}/announcements/edit/${selectedAnnouncement._id}`,
        {
          name: editAnnouncementName,
          description: editAnnouncementDescription,
          course: editAnnouncementCourse,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Announcement Updated Successfully!");
        setLocalAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement._id === selectedAnnouncement._id
              ? {
                  ...announcement,
                  name: editAnnouncementName,
                  description: editAnnouncementDescription,
                  course: { name: editAnnouncementCourse },
                }
              : announcement
          )
        );
        setFilteredAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement._id === selectedAnnouncement._id
              ? {
                  ...announcement,
                  name: editAnnouncementName,
                  description: editAnnouncementDescription,
                  course: { name: editAnnouncementCourse },
                }
              : announcement
          )
        );
        handleCloseModal();
      } else {
        setMessage(response.data.message || "Failed to update announcement");
      }
    } catch (error) {
      setMessage(`Error updating announcement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (announcementId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.delete(
        `${api}/announcements/delete/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMessage("Announcement Deleted Successfully");
        setLocalAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (announcement) => announcement._id !== announcementId
          )
        );
        setFilteredAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (announcement) => announcement._id !== announcementId
          )
        );
      } else {
        setMessage("Failed to delete announcement");
      }
    } catch (error) {
      setMessage(`Error deleting announcement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <div className="mb-4 flex items-center space-x-2">
        <div className="w-1/2">
          <label
            htmlFor="filterCourse"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Course:
          </label>
          <select
            id="filterCourse"
            className="mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 w-full"
            value={selectedFilterCourse}
            onChange={handleFilterChange}
          >
            <option value="">All Courses</option>
            {courseOptions?.length > 0 &&
              courseOptions.map((course) => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
          </select>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="searchAnnouncements"
            className="block text-sm font-medium text-gray-700"
          >
            Search Announcements:
          </label>
          <input
            type="text"
            id="searchAnnouncements"
            placeholder="Search announcements..."
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
                Name
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Description
              </th>
              <th className="border border-gray-300 py-3 px-4 text-left font-semibold text-gray-700">
                Course
              </th>
              <th className="border border-gray-300 py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAnnouncements.map((announcement) => (
              <tr key={announcement._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 py-2 px-4">
                  {announcement.name}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {announcement.description}
                </td>
                <td className="border border-gray-300 py-2 px-4">
                  {announcement.course?.name}
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(announcement)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredAnnouncements.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Announcement
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="editAnnouncementName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Announcement Name:
                </label>
                <input
                  type="text"
                  id="editAnnouncementName"
                  value={editAnnouncementName}
                  onChange={(e) => setEditAnnouncementName(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter announcement name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editAnnouncementDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description:
                </label>
                <textarea
                  id="editAnnouncementDescription"
                  value={editAnnouncementDescription}
                  onChange={(e) =>
                    setEditAnnouncementDescription(e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter announcement description"
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="editAnnouncementCourse"
                  className="block text-sm font-medium text-gray-700"
                >
                  Course:
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="editAnnouncementCourse"
                  value={editAnnouncementCourse}
                  onChange={(e) => setEditAnnouncementCourse(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a Course
                  </option>
                  {courseOptions?.length > 0 &&
                    courseOptions.map((courseOption) => (
                      <option key={courseOption._id} value={courseOption.name}>
                        {courseOption.name}
                      </option>
                    ))}
                </select>
              </div>
              {message && (
                <div
                  className={`mt-2 p-2 rounded-md  ${
                    message.startsWith("Announcement Updated Successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
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
                  {loading ? "Updating..." : "Update Announcement"}
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
    </div>
  );
};

export default AnnouncementTable;

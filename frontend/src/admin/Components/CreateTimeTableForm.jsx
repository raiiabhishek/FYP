import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthContext";

const api = import.meta.env.VITE_URL;

const CreateTimetableForm = ({ toggleCreateState }) => {
  const { authToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [course, setCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entries, setEntries] = useState([
    {
      dayOfWeek: "",
      startTime: "", // Added startTime
      endTime: "", // Added endTime
      module: "",
      teacher: "",
      classRoom: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [classGroups, setClassGroups] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);

  const dayOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    async function fetchTeachers() {
      const response = await axios.get(`${api}/teachers/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("teachers:", response.data);
      setTeacherOptions(response.data.data);
    }

    fetchTeachers();

    async function fetchCourses() {
      const response = await axios.get(`${api}/courses/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setCourseOptions(response.data.data);
    }

    fetchCourses();

    async function fetchGroups() {
      const response = await axios.get(`${api}/groups/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setClassGroups(response.data.data);
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    async function fetchModules() {
      if (course) {
        const response = await axios.get(`${api}/modules/course/${course}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setModuleOptions(response.data.data);
      } else {
        setModuleOptions([]);
      }
    }

    fetchModules();

    async function fetchTeachers() {
      if (course) {
        const response = await axios.get(`${api}/teachers/course/${course}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTeacherOptions(response.data.data);
      } else {
        setTeacherOptions([]);
      }
    }
    fetchTeachers();
  }, [course]);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        module: "",
        teacher: "",
        classRoom: "",
      },
    ]);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      console.log("Name:", name);
      console.log("Group:", group);
      console.log("Course:", course);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Entries:", entries);
      formData.append("name", name);
      formData.append("group", group);
      formData.append("course", course);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("entries", JSON.stringify(entries));
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const response = await axios.post(`${api}/timetables/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status !== "success") {
        setError(response.data.message || "Failed to create timetable");
      } else {
        setSuccess(response.data.message || "Timetable created successfully!");
        // Clear the form
        setName("");
        setGroup("");
        setCourse("");
        setStartDate("");
        setEndDate("");
        setEntries([
          {
            dayOfWeek: "",
            startTime: "",
            endTime: "",
            module: "",
            teacher: "",
            classRoom: "",
          },
        ]);
        toggleCreateState("timetable");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message || "An error occurred while creating the timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Timetable</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Timetable Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="group"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Group
          </label>
          <select
            id="group"
            className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            required
          >
            <option value="">Select a group</option>
            {classGroups.map((groupOption) => (
              <option key={groupOption.name} value={groupOption.name}>
                {groupOption.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="course"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Course
          </label>
          <select
            id="course"
            className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courseOptions.map((courseOption) => (
              <option key={courseOption.name} value={courseOption.name}>
                {courseOption.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Entries
          </label>
          {entries.map((entry, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="flex gap-3">
                <div className="w-full">
                  <label
                    htmlFor={`day-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Day
                  </label>
                  <select
                    id={`day-${index}`}
                    className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={entry.dayOfWeek}
                    onChange={(e) =>
                      handleEntryChange(index, "dayOfWeek", e.target.value)
                    }
                  >
                    <option value="">Select a day</option>
                    {dayOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`startTime-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id={`startTime-${index}`}
                    className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={entry.startTime}
                    onChange={(e) =>
                      handleEntryChange(index, "startTime", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`endTime-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id={`endTime-${index}`}
                    className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={entry.endTime}
                    onChange={(e) =>
                      handleEntryChange(index, "endTime", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`teacher-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Teacher
                  </label>
                  <select
                    id={`teacher-${index}`}
                    className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={entry.teacher}
                    onChange={(e) =>
                      handleEntryChange(index, "teacher", e.target.value)
                    }
                  >
                    <option value="">Select a teacher</option>
                    {teacherOptions.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`module-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Module
                  </label>
                  <select
                    id={`module-${index}`}
                    className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={entry.module}
                    onChange={(e) =>
                      handleEntryChange(index, "module", e.target.value)
                    }
                  >
                    <option value="">Select a module</option>
                    {moduleOptions.map((module) => (
                      <option key={module._id} value={module._id}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`classRoom-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Class Room
                  </label>
                  <input
                    type="text"
                    id={`classRoom-${index}`}
                    className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={entry.classRoom}
                    onChange={(e) =>
                      handleEntryChange(index, "classRoom", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEntry(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none mt-6"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEntry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Add Entry
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Timetable"}
        </button>
      </form>
    </div>
  );
};

export default CreateTimetableForm;

// components/EventForm.js
import React, { useState } from "react";
import axios from "axios";

const EventForm = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    allDay: false,
  });

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/events", event);
      console.log("Event created:", response.data);
      // Reset form here
      setEvent({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        location: "",
        allDay: false,
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Event</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={event.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={event.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={event.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={event.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Start Time:</label>
        <input
          type="time"
          name="startTime"
          value={event.startTime}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>End Time:</label>
        <input
          type="time"
          name="endTime"
          value={event.endTime}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>All Day Event:</label>
        <input
          type="checkbox"
          name="allDay"
          checked={event.allDay}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm;

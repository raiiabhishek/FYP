import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]); // New state for exams

  useEffect(() => {
    const fetchEventsAndExams = async () => {
      try {
        // Fetch Events
        const eventsRes = await axios.get("/api/events");
        const formattedEvents = eventsRes.data.map((event) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          title: event.title,
          allDay: event.allDay,
        }));
        setEvents(formattedEvents);

        // Fetch Exams
        const examsRes = await axios.get("/api/exams");
        const formattedExams = examsRes.data.map((exam) => ({
          ...exam,
          start: new Date(exam.examDate), // Assuming exam has a field 'examDate'
          end: new Date(exam.examDate),
          title: `${exam.courseName} Exam`, // Example title using exam data
          allDay: true, // You can change based on your need if exams have a timespan
          type: "exam", // added to differentiate events and exams
          color: "red", // added to differentiate the color
        }));
        setExams(formattedExams);
      } catch (error) {
        console.error("Error fetching events or exams:", error);
      }
    };

    fetchEventsAndExams();
  }, []);

  // Combine events and exams for the calendar
  const combinedEvents = [...events, ...exams];

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#3174ad"; // Default event color
    if (event.type === "exam") {
      backgroundColor = event.color; // Use the exam color
    }

    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };

    return {
      style: style,
    };
  };

  return (
    <div style={{ height: "700px" }}>
      <h2>Calendar</h2>
      <Calendar
        localizer={localizer}
        events={combinedEvents}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarView;

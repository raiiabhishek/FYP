import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";

const localizer = momentLocalizer(moment);

const CalendarView = ({ course }) => {
  const api = import.meta.env.VITE_URL;
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventsAndExams = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch Events
        const eventsRes = await axios.get(`${api}/events`);
        const formattedEvents = eventsRes?.data?.data?.map((event) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          title: event.title,
        }));
        setEvents(formattedEvents);

        // Fetch Exams
        const examsRes = await axios.get(`${api}/exams/course/${course}`);
        const formattedExams = examsRes?.data?.data?.map((exam) => ({
          ...exam,
          start: new Date(exam.examDate),
          end: new Date(exam.examDate),
          title: `${exam.name}`,
          type: "exam",
          color: "#e74c3c",
        }));
        setExams(formattedExams);
      } catch (err) {
        console.error("Error fetching events or exams:", err);
        setError("Failed to load events and exams.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsAndExams();
  }, []);

  const combinedEvents = [...events, ...exams];

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#3498db";
    if (event.type === "exam") {
      backgroundColor = event.color;
    }

    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "4px",
      opacity: 0.9,
      color: "white",
      fontSize: "0.8 rem",
      border: "none",
      padding: "2px 5px",
      display: "block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    };
    return {
      style: style,
    };
  };
  const dayPropGetter = (date) => {
    const day = date.getDay();
    if (day === 6) {
      // Only Saturday (6)
      return {
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.05)", // Subtle red for Saturday
        },
      };
    }
    return {};
  };
  const CustomEventComponent = ({ event }) => {
    return <div className="custom-event">{event.title}</div>;
  };

  if (isLoading) {
    return <div className="loading-message">Loading calendar...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={combinedEvents}
          startAccessor="start"
          endAccessor="end"
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventStyleGetter}
          className="responsive-calendar"
          components={{
            event: CustomEventComponent,
          }}
          views={["month", "agenda"]} // Only include month and agenda views
        />
      </div>
    </div>
  );
};

export default CalendarView;

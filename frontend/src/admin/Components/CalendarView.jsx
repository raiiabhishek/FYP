import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const api = import.meta.env.VITE_URL;
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchEventsAndExams = async () => {
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
        const examsRes = await axios.get(`${api}/exams`);
        const formattedExams = examsRes?.data?.data?.map((exam) => ({
          ...exam,
          start: new Date(exam.examDate),
          end: new Date(exam.examDate),
          title: `${exam.name}`,
          type: "exam",
          color: "red",
        }));
        setExams(formattedExams);
      } catch (error) {
        console.error("Error fetching events or exams:", error);
      }
    };

    fetchEventsAndExams();
  }, []);

  const combinedEvents = [...events, ...exams];

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#3174ad";
    if (event.type === "exam") {
      backgroundColor = event.color;
    }

    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      fontSize: "10px",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  const CustomEventComponent = ({ event }) => {
    return <div>{event.title}</div>;
  };

  return (
    <div className="h-[450px]">
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={combinedEvents}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        style={{ height: 400, width: 400 }}
        components={{
          event: CustomEventComponent,
        }}
      />
    </div>
  );
};

export default CalendarView;

import React, { useState } from "react";
import Sidebar from "./Components/SideBar";
import Fab from "./Components/FAB";
import CreateCourseForm from "./Components/CreateCourseForm";
import CreateModuleForm from "./Components/CreateModuleForm";
import CreateGroupForm from "./Components/CreateGroupForm";
import CreateTimetableForm from "./Components/CreateTimeTableForm";
import CreateEventForm from "./Components/CreateEventForm";
import CreateExamForm from "./Components/CreateExamForm";
import { Outlet } from "react-router-dom";
import CreateAnnouncementForm from "./Components/CreateAnnouncementForm";

export default function AdminHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [createStates, setCreateStates] = useState({
    module: false,
    group: false,
    course: false,
    exam: false,
    event: false,
    announcement: false,
    timetable: false,
  });

  const config = [
    { id: "module", label: "Modules" },
    { id: "group", label: "Groups" },
    { id: "course", label: "Courses" },
    { id: "exam", label: "Exams" },
    { id: "event", label: "Events" },
    { id: "announcement", label: "Announcements" },
    { id: "timetable", label: "Time Table" },
  ];

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const toggleCreateState = (id) => {
    setCreateStates((prevState) => {
      const updatedState = {};
      for (const key in prevState) {
        updatedState[key] = key === id ? !prevState[id] : false;
      }
      return updatedState;
    });
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const isAnyCreateFormOpen = Object.values(createStates).some(
    (state) => state
  );

  return (
    <div>
      <div className="lg:flex">
        <Sidebar />
        <div className="pt-20 px-5 lg:pt-0 w-full h-full">
          {createStates.course && (
            <CreateCourseForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.module && (
            <CreateModuleForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.group && (
            <CreateGroupForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.timetable && (
            <CreateTimetableForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.event && (
            <CreateEventForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.exam && (
            <CreateExamForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.announcement && (
            <CreateAnnouncementForm toggleCreateState={toggleCreateState} />
          )}
          {!isAnyCreateFormOpen && <Outlet />}
        </div>
      </div>
      <Fab
        isOpen={isOpen}
        toggleOptions={toggleOptions}
        config={config}
        toggleCreateState={toggleCreateState}
      />
    </div>
  );
}

import React from "react";
import { useState } from "react";
import Sidebar from "../SideBar";
import Fab from "./FAB";
import CreateCourseForm from "./CreateCourseForm";
import CreateModuleForm from "./CreateModuleForm";
import CreateGroupForm from "./CreateGroupForm";

export default function AdminHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [createStates, setCreateStates] = useState({
    module: false,
    group: false,
    course: false,
    exam: false,
    event: false,
    announcement: false,
  });

  const config = [
    { id: "module", label: "Modules" },
    { id: "group", label: "Groups" },
    { id: "course", label: "Courses" },
    { id: "exam", label: "Exams" },
    { id: "event", label: "Events" },
    { id: "announcement", label: "Announcements" },
  ];

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const toggleCreateState = (id) => {
    setCreateStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    if (isOpen) {
      setIsOpen(false);
    }
  };
  return (
    <div>
      <div className="md:flex">
        <Sidebar />
        <div className="pt-20 px-5 md:pt-0">
          {createStates.course && (
            <CreateCourseForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.module && (
            <CreateModuleForm toggleCreateState={toggleCreateState} />
          )}
          {createStates.group && (
            <CreateGroupForm toggleCreateState={toggleCreateState} />
          )}
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

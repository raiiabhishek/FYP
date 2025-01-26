import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  AiFillHome,
  AiOutlineUser,
  AiFillBook,
  AiFillCalendar,
  AiOutlineMessage,
  AiFillSetting,
  AiOutlineLogout,
  AiOutlineTeam,
  AiFillFileText,
  AiOutlineBarChart,
  AiOutlineCheckCircle,
  AiFillStar,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { AuthContext } from "../AuthContext";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  // Function to disable scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="flex w-full md:hidden fixed justify-between items-center z-50 bg-gray-100 rounded-md p-5 shadow-lg"
      >
        {isSidebarOpen ? (
          <AiOutlineClose size={24} />
        ) : (
          <AiOutlineMenu size={24} />
        )}
        <div className="sidebar-logo ">
          <h1>Herald College</h1>
        </div>
      </button>
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-100 p-4 transition-transform md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static flex flex-col`} // Added flex and flex-col
      >
        <div className="sidebar-logo mb-6 text-center">
          <h1>Herald College</h1>
        </div>

        <nav className="sidebar-nav flex-1 flex flex-col justify-between">
          {" "}
          {/* Added flex-1 and flex flex-col justify-between */}
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiFillHome className="mr-2" />
                Home
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/teacher"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiOutlineTeam className="mr-2" />
                Teacher
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/student"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiOutlineUser className="mr-2" />
                Student
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/classes"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiFillBook className="mr-2" />
                Classes
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/exams"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiFillFileText className="mr-2" />
                Exams
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/results"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiOutlineBarChart className="mr-2" />
                Results
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiOutlineCheckCircle className="mr-2" />
                Attendance
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiFillCalendar className="mr-2" />
                Events
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiOutlineMessage className="mr-2" />
                Messages
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/certificates"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiFillStar className="mr-2" />
                Certificates
              </NavLink>
            </li>
          </ul>
          <ul className="menu-list mt-auto border-t pt-2">
            <li className="menu-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiOutlineUser className="mr-2" />
                Profile
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                  }`
                }
              >
                <AiFillSetting className="mr-2" />
                Settings
              </NavLink>
            </li>
            <li className="menu-item">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded hover:bg-gray-200 "
              >
                <AiOutlineLogout className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState, useEffect, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import { SiGoogleclassroom } from "react-icons/si";
import { IoTimeSharp } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { AuthContext } from "../../../AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, role } = useContext(AuthContext); // Get role from context
  const location = useLocation();

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
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="flex w-full lg:hidden fixed justify-between items-center z-50 bg-gray-100 rounded-md p-5 shadow-lg"
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-100 p-4 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static flex flex-col`}
      >
        <div className="sidebar-logo mb-6 text-center">
          <h1>SMS</h1>
        </div>

        <nav className="sidebar-nav flex-1 flex flex-col justify-between">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink
                to="/home"
                className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                  isActive("/home") ? "bg-gray-200" : ""
                }`}
              >
                <AiFillHome className="mr-2" />
                Home
              </NavLink>
            </li>
            {/* Teacher Specific Links */}
            {role === "teacher" && (
              <>
                <li className="menu-item">
                  <NavLink
                    to="/students"
                    className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                      isActive("/students") ? "bg-gray-200" : ""
                    }`}
                  >
                    <AiOutlineUser className="mr-2" />
                    Students
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink
                    to="/groups"
                    className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                      isActive("/groups") ? "bg-gray-200" : ""
                    }`}
                  >
                    <SiGoogleclassroom className="mr-2" />
                    Groups
                  </NavLink>
                </li>
              </>
            )}

            <li className="menu-item">
              <NavLink
                to="/exams"
                className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                  isActive("/exams") ? "bg-gray-200" : ""
                }`}
              >
                <AiFillFileText className="mr-2" />
                Exams
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/results"
                className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                  isActive("/results") ? "bg-gray-200" : ""
                }`}
              >
                <AiOutlineBarChart className="mr-2" />
                Results
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/timetables"
                className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                  isActive("/timetables") ? "bg-gray-200" : ""
                }`}
              >
                <IoTimeSharp className="mr-2" />
                Time Tables
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/certificates"
                className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                  isActive("/certificates") ? "bg-gray-200" : ""
                }`}
              >
                <AiFillStar className="mr-2" />
                Certificates
              </NavLink>
            </li>
            {/* Student specific links */}
            {role === "student" && (
              <>
                <li className="menu-item">
                  <NavLink
                    to="/student/teachers"
                    className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                      isActive("/student/teachers") ? "bg-gray-200" : ""
                    }`}
                  >
                    <AiOutlineTeam className="mr-2" />
                    Teacher
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink
                    to="/results"
                    className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                      isActive("/results") ? "bg-gray-200" : ""
                    }`}
                  >
                    <AiOutlineBarChart className="mr-2" />
                    Results
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className="menu-list mt-auto border-t pt-2">
            <li className="menu-item">
              <NavLink
                to="/settings"
                className={`flex items-center p-2 rounded hover:bg-gray-200 no-underline ${
                  isActive("/settings") ? "bg-gray-200" : ""
                }`}
              >
                <AiFillSetting className="mr-2" />
                Settings
              </NavLink>
            </li>
            <li className="menu-item">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded hover:bg-gray-200 w-full no-underline"
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

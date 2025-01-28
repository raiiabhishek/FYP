import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from "../PrivateRouter.jsx";
import LandingPage from "./loggedOut/LandingPage.jsx";
import Login from "./loggedOut/Login.jsx";
import SignUp from "./loggedOut/Signup.jsx";
import AdminHome from "./admin/AdminHome.jsx";
import ForgotPassword from "./loggedOut/ForgotPassword.jsx";
import ResetPassword from "./loggedOut/ResetPassword.jsx";
import ATeacherList from "./admin/TeacherList.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import AStudentList from "./admin/StudentList.jsx";
import AGroupsList from "./admin/GroupsList.jsx";
import ACoursesList from "./admin/CoursesList.jsx";
import AModulesList from "./admin/ModulesList.jsx";
import AExamsList from "./admin/ExamsList.jsx";
import AEventsList from "./admin/EventsList.jsx";
import ATimetableList from "./admin/TimetableList.jsx";
import AAnnouncementList from "./admin/AnnouncementList.jsx";
import Home from "./loggedIn/Home.jsx";
import StudentList from "./loggedIn/teacher/StudentsList.jsx";
import GroupList from "./loggedIn/teacher/GroupsList.jsx";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/groups" element={<GroupList />} />
        {/* Parent Route for /admin */}
        <Route path="/admin" element={<PrivateRoute element={<AdminHome />} />}>
          {/* Nested Route for /admin/teacher */}
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<ATeacherList />} />
          <Route path="students" element={<AStudentList />} />
          <Route path="groups" element={<AGroupsList />} />
          <Route path="courses" element={<ACoursesList />} />
          <Route path="modules" element={<AModulesList />} />
          <Route path="exams" element={<AExamsList />} />
          <Route path="events" element={<AEventsList />} />
          <Route path="timetables" element={<ATimetableList />} />
          <Route path="announcements" element={<AAnnouncementList />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

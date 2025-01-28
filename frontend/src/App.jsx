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
import TeacherList from "./admin/TeacherList.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import StudentList from "./admin/StudentList.jsx";
import GroupsList from "./admin/GroupsList.jsx";
import CoursesList from "./admin/CoursesList.jsx";
import ModulesList from "./admin/ModulesList.jsx";
import ExamsList from "./admin/ExamsList.jsx";
import EventsList from "./admin/EventsList.jsx";
import TimetableList from "./admin/TimetableList.jsx";
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
        {/* Parent Route for /admin */}
        <Route path="/admin" element={<PrivateRoute element={<AdminHome />} />}>
          {/* Nested Route for /admin/teacher */}
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="students" element={<StudentList />} />
          <Route path="groups" element={<GroupsList />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="modules" element={<ModulesList />} />
          <Route path="exams" element={<ExamsList />} />
          <Route path="events" element={<EventsList />} />
          <Route path="timetables" element={<TimetableList />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

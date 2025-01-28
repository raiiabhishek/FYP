import React, { useContext } from "react";
import TeacherHome from "./teacher/TeacherHome";
import StudentHome from "./student/StudentHome";
import { AuthContext } from "../../AuthContext";

export default function Home() {
  const { role } = useContext(AuthContext);
  if (role === "teacher") {
    return <TeacherHome />;
  } else {
    return <StudentHome />;
  }
}

import React from "react";
import { Outlet } from "react-router-dom";
import TeacherPage from "./TeacherPage/index.jsx";
import CreateTeacher from "./CreateTeacher/index.jsx";
import UpdateTeacher from "./UpdateTeacher/index.jsx";

export default function Teacher() {
  return <Outlet />;
}

export { TeacherPage, CreateTeacher, UpdateTeacher };

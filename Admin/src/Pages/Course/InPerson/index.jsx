import React from "react";
import { Outlet } from "react-router-dom";

export default function InPersonCourseLayout() {
  return <Outlet />;
}

export { default as InPersonCourseListPage } from "./InPersonCourseListPage/index.jsx";
export { default as CreateInPersonCourse } from "./CreateInPersonCourse/index.jsx";
export { default as UpdateInPersonCourse } from "./UpdateInPersonCourse/index.jsx";
export { default as SingleInPersonCourse } from "./SingleInPersonCourse/index.jsx";

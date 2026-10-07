import React from "react";
import { Outlet } from "react-router-dom";

export default function InPersonCourseLayout() {
  return <Outlet />;
}

export { default as InPersonCourseListPage } from "./InPersonCourseListPage";
export { default as CreateInPersonCourse } from "./CreateInPersonCourse";
export { default as UpdateInPersonCourse } from "./UpdateInPersonCourse";
export { default as SingleInPersonCourse } from "./SingleInPersonCourse";

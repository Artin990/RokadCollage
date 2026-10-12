import React from "react";
import { Outlet } from "react-router-dom";

export default function VirtualCourseLayout() {
  return <Outlet />;
}

export { default as VirtualCourseListPage } from "./VirtualCourseListPage/index.jsx";
export { default as CreateVirtualCourse } from "./CreateVirtualCourse/index.jsx";
export { default as UpdateVirtualCourse } from "./UpdateVirtualCourse/index.jsx";
export { default as SingleVirtualCourse } from "./SingleVirtualCourse/index.jsx";

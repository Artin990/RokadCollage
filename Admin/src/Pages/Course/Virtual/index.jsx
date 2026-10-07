import React from "react";
import { Outlet } from "react-router-dom";

export default function VirtualCourseLayout() {
  return <Outlet />;
}

export { default as VirtualCourseListPage } from "./VirtualCourseListPage";
export { default as CreateVirtualCourse } from "./CreateVirtualCourse";
export { default as UpdateVirtualCourse } from "./UpdateVirtualCourse";
export { default as SingleVirtualCourse } from "./SingleVirtualCourse";

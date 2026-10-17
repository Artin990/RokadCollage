import React from "react";
import "@/legacy-pages/DepartmentPage/department.css";
import { SkeletonDepartmentPage } from "@/legacy-pages/DepartmentPage/components/SkeletonDepartmentHub.jsx";

export default function DepartmentLoading() {
  return <SkeletonDepartmentPage />;
}

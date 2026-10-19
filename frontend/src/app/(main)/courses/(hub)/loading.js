import React from "react";
import "@/legacy-pages/CoursesPage/courses-hub.css";
import { SkeletonCoursesPage } from "@/legacy-pages/CoursesPage/components/SkeletonCoursesHub.jsx";

export default function CoursesHubLoading() {
  return <SkeletonCoursesPage />;
}

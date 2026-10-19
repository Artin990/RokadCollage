"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SkeletonCourseSingle from "@/legacy-pages/CourseSingle/components/SkeletonCourseSingle";
import SkeletonCourseInPerson from "@/legacy-pages/CourseSingle/components/SkeletonCourseInPerson";

export default function SingleCourseLoading() {
  const pathname = usePathname() || "";
  const decoded = decodeURIComponent(pathname).toLowerCase();

  const isInPerson =
    decoded.includes("bootcamp") ||
    decoded.includes("حضوری") ||
    decoded.includes("in-person") ||
    decoded.includes("inperson") ||
    decoded.includes("workshop") ||
    decoded.includes("کارگاه") ||
    decoded.includes("بوت‌کمپ") ||
    decoded.includes("بوتکمپ") ||
    decoded.includes("figma") ||
    decoded.includes("فیگما") ||
    decoded.includes("ui-ux") ||
    decoded.includes("ux") ||
    decoded.includes("ui") ||
    decoded.includes("camp") ||
    decoded.includes("6acd22418fb60eb8907d8af5") ||
    decoded.includes("6acd22418fb60eb8907d8af6");

  if (isInPerson) {
    return <SkeletonCourseInPerson />;
  }

  return <SkeletonCourseSingle />;
}

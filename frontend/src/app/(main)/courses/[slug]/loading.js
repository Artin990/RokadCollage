"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SkeletonCourseSingle from "@/legacy-pages/CourseSingle/components/SkeletonCourseSingle";
import SkeletonCourseInPerson from "@/legacy-pages/CourseSingle/components/SkeletonCourseInPerson";

const IN_PERSON_IDENTIFIERS = [
  "icdl",
  "photoshop",
  "فتوشاپ",
  "premiere",
  "پریمیر",
  "after-effects",
  "aftereffects",
  "افترافکت",
  "wordpress",
  "وردپرس",
  "ui-ux",
  "ui",
  "ux",
  "figma",
  "فیگما",
  "frontend",
  "front",
  "فرانت",
  "backend",
  "back",
  "بک",
  "ai",
  "هوش-مصنوعی",
  "سواد-دیجیتال",
  "bootcamp",
  "بوت‌کمپ",
  "بوتکمپ",
  "حضوری",
  "in-person",
  "inperson",
  "workshop",
  "کارگاه",
  "camp",
  // MongoDB IDs
  "6adfabec1c8f1dee7a5156e2",
  "6adfabec1c8f1dee7a5156ed",
  "6adfabec1c8f1dee7a5156f3",
  "6adfabec1c8f1dee7a5156f9",
  "6adfabec1c8f1dee7a5156ff",
  "6adfabec1c8f1dee7a515705",
  "6adfabec1c8f1dee7a51570b",
  "6adfabec1c8f1dee7a515711",
  "6adfabec1c8f1dee7a515717",
  "6acd22418fb60eb8907d8af5",
  "6acd22418fb60eb8907d8af6",
];

export default function SingleCourseLoading() {
  const pathname = usePathname() || "";
  const currentPath =
    (typeof window !== "undefined" && window.location.pathname) || pathname || "";
  const decoded = decodeURIComponent(currentPath).toLowerCase();
  const slug = decoded.split("/").filter(Boolean).pop() || "";

  let storedMode = null;
  if (typeof window !== "undefined") {
    try {
      storedMode =
        sessionStorage.getItem(`rokad_course_mode_${slug}`) ||
        sessionStorage.getItem("rokad_last_course_mode");
    } catch (_) {}
  }

  const isWorkshop = decoded.includes("workshop") || decoded.includes("کارگاه");

  const isInPerson =
    storedMode === "in-person" ||
    storedMode === "onsite" ||
    IN_PERSON_IDENTIFIERS.some((id) => decoded.includes(id));

  if (isInPerson) {
    return <SkeletonCourseInPerson isWorkshop={isWorkshop} />;
  }

  return <SkeletonCourseSingle />;
}

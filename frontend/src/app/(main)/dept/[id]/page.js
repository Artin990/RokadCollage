import { Suspense } from "react";
import DepartmentClient from "./DepartmentClient";
import { getAllCourses } from "@/services/courseService";
import { departments } from "@/data/departments";
import { SkeletonDepartmentPage } from "@/legacy-pages/DepartmentPage/components/SkeletonDepartmentHub";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || "languages");
  const dept = departments[decodedId];
  return {
    title: dept ? `دپارتمان ${dept.name} | کالج رکاد` : "دپارتمان‌های کالج رکاد",
    description: dept?.lead || "دپارتمان‌های تخصصی کالج رکاد",
  };
}

export default async function SingleDepartmentRoute({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || "languages");
  const initialCourses = await getAllCourses().catch(() => []);

  return (
    <Suspense fallback={<SkeletonDepartmentPage deptId={decodedId} />}>
      <DepartmentClient deptId={decodedId} initialCourses={initialCourses} />
    </Suspense>
  );
}

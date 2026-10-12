import { Suspense } from "react";
import DepartmentClient from "./DepartmentClient";
import { getAllCourses } from "@/services/courseService";

export default async function SingleDepartmentRoute({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || "languages");
  const initialCourses = await getAllCourses().catch(() => []);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-['IRANSansX'] text-stone-500">در حال بارگذاری دپارتمان...</div>}>
      <DepartmentClient deptId={decodedId} initialCourses={initialCourses} />
    </Suspense>
  );
}

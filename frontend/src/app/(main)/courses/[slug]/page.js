import { Suspense } from "react";
import CourseSingleClient from "./CourseSingleClient";

export default async function SingleCourseRoute({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-['IRANSansX'] text-stone-500">در حال بارگذاری دوره...</div>}>
      <CourseSingleClient slug={decodedSlug} />
    </Suspense>
  );
}

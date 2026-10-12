import { Suspense } from "react";
import DepartmentClient from "./DepartmentClient";

export default async function SingleDepartmentRoute({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || "languages");

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-['IRANSansX'] text-stone-500">در حال بارگذاری دپارتمان...</div>}>
      <DepartmentClient deptId={decodedId} />
    </Suspense>
  );
}

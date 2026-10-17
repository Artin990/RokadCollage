import { Suspense } from "react";
import MyCoursesClient from "./MyCoursesClient";
import SkeletonMyCourses from "./components/SkeletonMyCourses";

export const metadata = {
  title: "دوره‌های من | کالج رکاد",
  description: "مدیریت دوره‌های ثبت‌نام‌شده، لایسنس اسپات‌پلیر و وضعیت یادگیری",
};

export default function MyCoursesPage() {
  return (
    <Suspense fallback={<SkeletonMyCourses />}>
      <MyCoursesClient />
    </Suspense>
  );
}

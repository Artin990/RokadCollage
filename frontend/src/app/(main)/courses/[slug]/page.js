import { Suspense } from "react";
import CourseSingleClient from "./CourseSingleClient";
import { getCourseBySlugOrId } from "@/services/courseService";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  const course = await getCourseBySlugOrId(decodedSlug).catch(() => null);

  if (!course) {
    return {
      title: "دوره تخصصی | کالج رکاد",
    };
  }

  const title = `${course.title || "دوره تخصصی"} | کالج رکاد`;
  const description =
    course.description ||
    course.headline ||
    "آموزش پروژه‌محور و ورود به بازار کار در کالج بین‌المللی رکاد";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: course.img ? [course.img] : ["/assets/StatCard/yellow.png"],
    },
  };
}

export default async function SingleCourseRoute({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  const initialCourse = await getCourseBySlugOrId(decodedSlug).catch(() => null);

  const courseSchema = initialCourse
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: initialCourse.title,
        description:
          initialCourse.description ||
          initialCourse.headline ||
          "آموزش پروژه‌محور و مهارت‌های تخصصی بازار کار در کالج رکاد",
        provider: {
          "@type": "Organization",
          name: "کالج رکاد",
          sameAs: "https://rokad.ir",
        },
        ...(initialCourse.teachers && initialCourse.teachers.length > 0
          ? {
              instructor: initialCourse.teachers.map((t) => ({
                "@type": "Person",
                name: typeof t === "object" ? t.name || t.fullName : t,
              })),
            }
          : initialCourse.instructor
          ? {
              instructor: {
                "@type": "Person",
                name:
                  typeof initialCourse.instructor === "object"
                    ? initialCourse.instructor.fullName || initialCourse.instructor.name
                    : initialCourse.instructor,
              },
            }
          : {}),
        offers: {
          "@type": "Offer",
          price: initialCourse.price || 0,
          priceCurrency: "IRT",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center font-sans text-stone-500">
            در حال بارگذاری دوره...
          </div>
        }
      >
        <CourseSingleClient slug={decodedSlug} initialCourse={initialCourse} />
      </Suspense>
    </>
  );
}

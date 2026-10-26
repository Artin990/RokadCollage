import { Suspense } from "react";
import CourseSingleClient from "./CourseSingleClient";
import { getCourseBySlugOrId } from "@/services/courseService";
import SkeletonCourseSingle from "@/legacy-pages/CourseSingle/components/SkeletonCourseSingle";
import SkeletonCourseInPerson from "@/legacy-pages/CourseSingle/components/SkeletonCourseInPerson";

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

  const isInPerson =
    initialCourse?.mode === "in-person" ||
    initialCourse?.isInPerson ||
    initialCourse?.type === "حضوری" ||
    initialCourse?.courseType === "دوره حضوری" ||
    initialCourse?.courseType === "کارگاه حضوری" ||
    initialCourse?.courseType?.includes("حضوری") ||
    Boolean(initialCourse?.approximateSessions) ||
    Boolean(initialCourse?.tuitionPerPerson) ||
    Boolean(initialCourse?.location?.address) ||
    [
      "icdl", "photoshop", "فتوشاپ", "premiere", "پریمیر", "after-effects", "aftereffects", "افترافکت",
      "wordpress", "وردپرس", "ui-ux", "ui", "ux", "figma", "فیگما", "frontend", "front", "فرانت",
      "backend", "back", "بک", "ai", "هوش-مصنوعی", "سواد-دیجیتال", "bootcamp", "بوت‌کمپ", "بوتکمپ",
      "حضوری", "in-person", "inperson", "workshop", "کارگاه", "camp",
      "6adfabec1c8f1dee7a5156e2", "6adfabec1c8f1dee7a5156ed", "6adfabec1c8f1dee7a5156f3",
      "6adfabec1c8f1dee7a5156f9", "6adfabec1c8f1dee7a5156ff", "6adfabec1c8f1dee7a515705",
      "6adfabec1c8f1dee7a51570b", "6adfabec1c8f1dee7a515711", "6adfabec1c8f1dee7a515717",
      "6acd22418fb60eb8907d8af5", "6acd22418fb60eb8907d8af6"
    ].some((id) => decodedSlug.includes(id));

  const isWorkshop =
    initialCourse?.courseType === "کارگاه حضوری" ||
    decodedSlug.includes("workshop") ||
    decodedSlug.includes("کارگاه");

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
      <Suspense fallback={isInPerson ? <SkeletonCourseInPerson isWorkshop={isWorkshop} /> : <SkeletonCourseSingle />}>
        <CourseSingleClient slug={decodedSlug} initialCourse={initialCourse} />
      </Suspense>
    </>
  );
}

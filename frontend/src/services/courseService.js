export const MOCK_STATIC_COURSES = [
  {
    "_id": "c-1",
    "id": 1,
    "slug": "figma-ui-design",
    "title": "طراحی رابط کاربری با فیگما",
    "category": "فناوری اطلاعات",
    "mode": "online",
    "isOnline": true,
    "price": 2400000,
    "discountPrice": 1800000,
    "duration": "۴۲ ساعت",
    "sessions": 24,
    "studentsCount": 1240,
    "rating": 4.9,
    "teacher": {
      "fullName": "نیلوفر رستمی",
      "role": "طراح ارشد محصول"
    },
    "instructor": "نیلوفر رستمی",
    "description": "جامع‌ترین دوره یادگیری فیگما از مقدماتی تا سیستم‌سازی و پروتوتایپ پیشرفته",
    "curriculum": [
      {
        "title": "فصل اول: الفبای دیزاین سیستم و ورود به ابزار",
        "lessonsCount": 4,
        "isFree": true
      },
      {
        "title": "فصل دوم: AutoLayout و کامپوننت‌های ریسپانسیو",
        "lessonsCount": 8,
        "isFree": false
      },
      {
        "title": "فصل سوم: ساخت دیزاین توکن‌ها و کتابخانه کامپوننت",
        "lessonsCount": 6,
        "isFree": false
      },
      {
        "title": "فصل چهارم: هنداف به توسعه‌دهندگان فرانت‌اند",
        "lessonsCount": 6,
        "isFree": false
      }
    ]
  },
  {
    "_id": "c-2",
    "id": 2,
    "slug": "react-nextjs",
    "title": "برنامه‌نویسی وب با React و Next.js",
    "category": "فناوری اطلاعات",
    "mode": "in-person",
    "isOnline": false,
    "price": 4800000,
    "discountPrice": 3800000,
    "duration": "۶۰ ساعت",
    "sessions": 30,
    "studentsCount": 2840,
    "rating": 4.9,
    "teacher": {
      "fullName": "مهندس آرش تهرانی",
      "role": "معمار ارشد نرم‌افزار"
    },
    "instructor": "مهندس آرش تهرانی",
    "description": "بوت‌کمپ حضوری و کارگاهی ورود به بازار کار فرانت‌اند"
  },
  {
    "_id": "c-3",
    "id": 3,
    "slug": "digital-marketing",
    "title": "دیجیتال مارکتینگ و رشد استارتاپ",
    "category": "کسب و کار",
    "mode": "online",
    "isOnline": true,
    "price": 2200000,
    "discountPrice": null,
    "duration": "۳۶ ساعت",
    "sessions": 18,
    "studentsCount": 2100,
    "rating": 4.7,
    "teacher": {
      "fullName": "سارا کاظمی",
      "role": "مدیر رشد"
    },
    "instructor": "سارا کاظمی",
    "description": "استراتژی‌های بازاریابی عملکردی، سئو و تبلیغات دیجیتال"
  },
  {
    "_id": "c-4",
    "id": 4,
    "slug": "business-english",
    "title": "مکالمه و زبان تخصصی کسب و کار",
    "category": "زبان‌های خارجی",
    "mode": "in-person",
    "isOnline": false,
    "price": 3100000,
    "discountPrice": 2600000,
    "duration": "۴۸ ساعت",
    "sessions": 24,
    "studentsCount": 950,
    "rating": 4.8,
    "teacher": {
      "fullName": "دکتر علیرضا پارسا",
      "role": "مدرس بین‌المللی"
    },
    "instructor": "دکتر علیرضا پارسا",
    "description": "آمادگی مذاکره، مصاحبه شغلی انگلیسی و نگارش تجاری"
  }
];

import { apiRequest } from "@/lib/api";

/**
 * دریافت لیست دوره‌های حضوری
 */
export async function getInPersonCourses() {
  const res = await apiRequest("/in-person-courses");
  const list = res?.data || res;
  return (Array.isArray(list) && list.length > 0) ? list : MOCK_STATIC_COURSES;
}

/**
 * دریافت جزئیات یک دوره حضوری بر اساس شناسه
 */
export async function getInPersonCourseById(id) {
  const res = await apiRequest(`/in-person-courses/${id}`);
  const item = res?.data || res;
  return item || MOCK_STATIC_COURSES[0];
}

/**
 * دریافت لیست دوره‌های آنلاین و مجازی
 */
export async function getVirtualCourses() {
  const res = await apiRequest("/virtual-courses");
  return res?.data || res || [];
}

/**
 * دریافت جزئیات یک دوره آنلاین بر اساس شناسه
 */
export async function getVirtualCourseById(id) {
  const res = await apiRequest(`/virtual-courses/${id}`);
  return res?.data || res;
}

/**
 * دریافت همه دوره‌ها (ترکیب حضوری و مجازی)
 */
export async function getAllCourses() {
  try {
    const [inPerson, virtual] = await Promise.all([
      getInPersonCourses().catch(() => []),
      getVirtualCourses().catch(() => []),
    ]);

    const formattedInPerson = (Array.isArray(inPerson) ? inPerson : []).map((c) => ({
      ...c,
      isVirtual: false,
      mode: "in-person",
      typeLabel: "حضوری",
    }));

    const formattedVirtual = (Array.isArray(virtual) ? virtual : []).map((c) => ({
      ...c,
      isVirtual: true,
      mode: "online",
      typeLabel: "مجازی",
    }));

    return [...formattedInPerson, ...formattedVirtual];
  } catch (err) {
    console.error("Error loading all courses:", err);
    return [];
  }
}

/**
 * دریافت یک دوره با شناسه یا اسلاگ
 */
export async function getCourseBySlugOrId(identifier) {
  if (!identifier) return null;
  const all = await getAllCourses();
  const clean = String(identifier).trim().toLowerCase();
  let found = all.find(
    (c) =>
      c.slug === clean ||
      c.id === clean ||
      c._id === clean ||
      (c.title && c.title.toLowerCase().includes(clean))
  );

  if (!found) {
    if (clean.includes("react") || clean.includes("front")) {
      found = all.find((c) => (c.slug && c.slug.includes("react")) || (c.title && c.title.includes("React")));
    } else if (clean.includes("ux") || clean.includes("ui") || clean.includes("figma")) {
      found = all.find((c) => (c.slug && (c.slug.includes("ux") || c.slug.includes("ui"))) || (c.title && c.title.includes("UI/UX")));
    } else if (clean.includes("seo") || clean.includes("سئو")) {
      found = all.find((c) => (c.slug && c.slug.includes("seo")) || (c.title && c.title.includes("سئو")));
    } else if (clean.includes("word") || clean.includes("وردپرس")) {
      found = all.find((c) => (c.slug && c.slug.includes("word")) || (c.title && c.title.includes("وردپرس")));
    }
  }
  if (found) {
    if (found.isVirtual) {
      const details = await getVirtualCourseById(found._id || found.id).catch(() => null);
      return { ...found, ...(details || {}) };
    } else {
      const details = await getInPersonCourseById(found._id || found.id).catch(() => null);
      return { ...found, ...(details || {}) };
    }
  }

  // Fallback if identifier is a direct MongoDB ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(clean)) {
    const [inP, virt] = await Promise.all([
      getInPersonCourseById(clean).catch(() => null),
      getVirtualCourseById(clean).catch(() => null),
    ]);
    if (inP) return { ...inP, isVirtual: false, mode: "in-person" };
    if (virt) return { ...virt, isVirtual: true, mode: "online" };
  }

  return null;
}

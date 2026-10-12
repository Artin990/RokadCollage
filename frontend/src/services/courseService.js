import { apiRequest } from "@/lib/api";

/**
 * دریافت لیست دوره‌های حضوری
 */
export async function getInPersonCourses() {
  const res = await apiRequest("/in-person-courses");
  return res?.data || res || [];
}

/**
 * دریافت جزئیات یک دوره حضوری بر اساس شناسه
 */
export async function getInPersonCourseById(id) {
  const res = await apiRequest(`/in-person-courses/${id}`);
  return res?.data || res;
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

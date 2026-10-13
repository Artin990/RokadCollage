import { redirect } from "next/navigation";

export default function MyCoursesPage() {
  redirect("/panel?tab=courses");
}

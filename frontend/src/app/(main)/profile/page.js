import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/panel?tab=profile");
}

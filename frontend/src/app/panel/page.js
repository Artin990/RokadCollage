"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/legacy-pages/Panel/Dashboard.jsx";
import Profile from "@/legacy-pages/Panel/Profile.jsx";
import Assignments from "@/legacy-pages/Panel/Assignments.jsx";
import PanelCourses from "@/legacy-pages/Panel/Courses.jsx";
import Certificates from "@/legacy-pages/Panel/Certificates.jsx";
import Mentor from "@/legacy-pages/Panel/Mentor.jsx";
import StudyGroup from "@/legacy-pages/Panel/StudyGroup.jsx";
import Events from "@/legacy-pages/Panel/Events.jsx";
import Support from "@/legacy-pages/Panel/Support.jsx";
import { isUserLoggedIn } from "@/data/panelStore.js";
import { useRouter } from "next/navigation";

const PANEL_PAGES = {
  dashboard: Dashboard,
  profile: Profile,
  assignments: Assignments,
  courses: PanelCourses,
  certs: Certificates,
  mentor: Mentor,
  group: StudyGroup,
  events: Events,
  support: Support,
};

export default function PanelPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoggedIn()) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("rokad_auth_redirect", "panel");
      }
      router.push("/auth");
      return;
    }

    const parseHash = () => {
      const h = window.location.hash.replace(/^#\/?/, "");
      if (h && PANEL_PAGES[h]) {
        setCurrentPage(h);
      } else {
        setCurrentPage("dashboard");
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, [router]);

  if (!mounted) return null;

  const ActiveComponent = PANEL_PAGES[currentPage] || Dashboard;

  const navigateTo = (pageKey) => {
    window.location.hash = pageKey;
    setCurrentPage(pageKey);
  };

  return <ActiveComponent onNavigate={navigateTo} />;
}

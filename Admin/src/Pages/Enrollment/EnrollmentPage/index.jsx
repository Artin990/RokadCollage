import React, { useState } from "react";
import { PageHeader } from "../../../Components/UI";
import SchoolIcon from "@mui/icons-material/School";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import InPersonEnrollmentsTab from "../components/InPersonEnrollmentsTab";
import VirtualEnrollmentsTab from "../components/VirtualEnrollmentsTab";

/**
 * Main Enrollment Management Page
 * Split into In-Person (3-level) and Virtual (2-level + SpotPlayer license) tabs.
 */
export default function EnrollmentPage() {
  const [activeTab, setActiveTab] = useState("in-person"); // "in-person" | "virtual"

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title="مدیریت ثبت‌نام‌ها"
        subtitle="مشاهده و مدیریت فراگیران، کدهای کلاس و وضعیت لایسنس‌های اسپات‌پلیر"
      />

      {/* Tabs navigation */}
      <div className="flex items-center gap-3 border-b border-border mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("in-person")}
          className={`cursor-pointer pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "in-person"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-secondary"
          }`}
        >
          <SchoolIcon fontSize="small" />
          <span>دوره‌های حضوری (کدهای کلاس)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("virtual")}
          className={`cursor-pointer pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "virtual"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-secondary"
          }`}
        >
          <OndemandVideoIcon fontSize="small" />
          <span>دوره‌های مجازی (لایسنس اسپات‌پلیر)</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "in-person" ? (
        <InPersonEnrollmentsTab />
      ) : (
        <VirtualEnrollmentsTab />
      )}
    </div>
  );
}

import React, { useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { PageHeader, Tabs } from "../../../Components/UI";
import InPersonEnrollmentsTab from "../components/InPersonEnrollmentsTab";
import VirtualEnrollmentsTab from "../components/VirtualEnrollmentsTab";

/**
 * Main Enrollment Management Page
 * Split into In-Person (3-level) and Virtual (2-level + SpotPlayer license) tabs.
 */
export default function EnrollmentPage() {
  const [activeTab, setActiveTab] = useState("in-person"); // "in-person" | "virtual"

  const tabs = [
    {
      id: "in-person",
      key: "in-person",
      label: "دوره‌های حضوری (کدهای کلاس)",
      icon: <SchoolIcon fontSize="small" />,
    },
    {
      id: "virtual",
      key: "virtual",
      label: "دوره‌های مجازی (لایسنس اسپات‌پلیر)",
      icon: <OndemandVideoIcon fontSize="small" />,
    },
  ];

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="مدیریت ثبت‌نام‌ها"
        subtitle="مشاهده و مدیریت فراگیران، کدهای کلاس و وضعیت لایسنس‌های اسپات‌پلیر"
      />

      {/* Tabs navigation */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {/* Active Tab Content */}
      {activeTab === "in-person" ? (
        <InPersonEnrollmentsTab />
      ) : (
        <VirtualEnrollmentsTab />
      )}
    </div>
  );
}

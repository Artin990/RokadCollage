import React from "react";
import { FormikProvider } from "formik";
import { Button, Card } from "../../../../Components/UI";
import CourseBasicInfoSection from "../../shared/sections/CourseBasicInfoSection";
import CourseDiscountSection from "../../shared/sections/CourseDiscountSection";
import CourseTeachersSection from "../../shared/sections/CourseTeachersSection";
import CourseDescriptionSection from "../../shared/sections/CourseDescriptionSection";
import CourseIconSection from "../../shared/sections/CourseIconSection";
import CourseSprintsSection from "../../shared/sections/CourseSprintsSection";
import VirtualSpotPlayerSection from "./VirtualSpotPlayerSection";

export default function VirtualCourseForm({
  formik,
  isSubmitting,
  submitLabel = "ثبت دوره مجازی",
  onToggleRemoteCode,
  togglingCodeId,
}) {
  return (
    <Card className="p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          {/* Shared Basic Info */}
          <CourseBasicInfoSection />

          {/* Shared Pricing & Discounts */}
          <CourseDiscountSection
            onToggleRemoteCode={onToggleRemoteCode}
            togglingCodeId={togglingCodeId}
          />

          {/* Shared Teachers */}
          <CourseTeachersSection />

          {/* Shared Description & Tags */}
          <CourseDescriptionSection />

          {/* Shared SVG Icon */}
          <CourseIconSection />

          {/* Course Sprints / Chapters */}
          <CourseSprintsSection />

          {/* Virtual Course Exclusive Section: SpotPlayer Course ID */}
          <VirtualSpotPlayerSection />

          {/* Submit Action */}
          <div className="flex justify-end pt-4 border-t border-border/80">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </FormikProvider>
    </Card>
  );
}

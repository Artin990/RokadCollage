import React from "react";
import { FormikProvider } from "formik";
import { Button, Card } from "../../../../Components/UI";
import CourseBasicInfoSection from "../../components/CourseBasicInfoSection";
import CourseDiscountSection from "../../components/CourseDiscountSection";
import CourseTeachersSection from "../../components/CourseTeachersSection";
import CourseDescriptionSection from "../../components/CourseDescriptionSection";
import CourseImageSection from "../../components/CourseImageSection";
import CourseSprintsSection from "../../components/CourseSprintsSection";
import VirtualSpotPlayerSection from "./VirtualSpotPlayerSection";

export default function VirtualCourseForm({
  formik,
  isSubmitting,
  submitLabel = "ثبت دوره مجازی",
  onToggleRemoteCode,
  togglingCodeId,
}) {
  return (
    <Card className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
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

          {/* Shared Course Cover Image */}
          <CourseImageSection />

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
              className="w-full sm:w-auto"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </FormikProvider>
    </Card>
  );
}

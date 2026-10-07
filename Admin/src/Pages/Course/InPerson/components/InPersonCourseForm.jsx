import React from "react";
import { FormikProvider } from "formik";
import { Button, Card } from "../../../../Components/UI";
import CourseBasicInfoSection from "../../shared/sections/CourseBasicInfoSection";
import CourseDiscountSection from "../../shared/sections/CourseDiscountSection";
import CourseTeachersSection from "../../shared/sections/CourseTeachersSection";
import CourseDescriptionSection from "../../shared/sections/CourseDescriptionSection";
import CourseIconSection from "../../shared/sections/CourseIconSection";
import InPersonSprintsSection from "./InPersonSprintsSection";
import InPersonSessionsSection from "./InPersonSessionsSection";
import InPersonLocationSection from "./InPersonLocationSection";

export default function InPersonCourseForm({
  formik,
  isSubmitting,
  submitLabel = "ثبت دوره حضوری",
  mode = "create",
  courseId = null,
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

          {/* In-Person Exclusive Sections */}
          <div className="flex flex-col gap-6 pt-5 border-t border-border/80">
            <div className="bg-primary-light border border-primary-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-secondary text-sm md:text-base">
                  اطلاعات اختصاصی دوره حضوری
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  سرفصل‌ها و اسپرینت‌های کارگاهی، زمان‌بندی و موقعیت مکانی
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-primary text-secondary">
                دوره حضوری
              </span>
            </div>

            <InPersonSprintsSection />

            <InPersonSessionsSection mode={mode} courseId={courseId} />

            <InPersonLocationSection />
          </div>

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

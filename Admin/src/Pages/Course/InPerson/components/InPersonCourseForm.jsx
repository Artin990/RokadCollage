import React from "react";
import { FormikProvider } from "formik";
import { Button, Card, Input, Select, Textarea } from "../../../../Components/UI";
import CourseBasicInfoSection from "../../components/CourseBasicInfoSection";
import CourseDiscountSection from "../../components/CourseDiscountSection";
import CourseTeachersSection from "../../components/CourseTeachersSection";
import CourseDescriptionSection from "../../components/CourseDescriptionSection";
import CourseImageSection from "../../components/CourseImageSection";
import CourseSprintsSection from "../../components/CourseSprintsSection";
import CourseSessionsManager from "./CourseSessionsManager/index.jsx";
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
  const { values, handleChange, handleBlur } = formik;

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

          {/* In-Person Exclusive Sections */}
          <div className="flex flex-col gap-6 pt-5 border-t border-border/80">
            <div className="bg-primary-light border border-primary-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-secondary text-sm md:text-base">
                  اطلاعات اختصاصی دوره حضوری و ژوژمان پایانی
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  نوع دوره، تعداد جلسات، ساعات، روزهای برگزاری، مدرس پیشنهادی، تاریخ‌ها و رویداد ژوژمان
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-primary text-secondary">
                {values.courseType || "دوره حضوری"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="نوع قالب و فرمت"
                name="courseType"
                options={[
                  { value: "دوره حضوری", label: "دوره حضوری (قالب کامل ترمیک/پروژه‌محور)" },
                  { value: "کارگاه حضوری", label: "کارگاه حضوری (قالب ورکشاپ فشرده)" },
                ]}
                value={values.courseType || "دوره حضوری"}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="نام مدرس پیشنهادی"
                name="proposedTeacher"
                placeholder="مثال: مهندس آرش تهرانی"
                value={values.proposedTeacher || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="تعداد جلسات تقریبی"
                name="approximateSessions"
                placeholder="مثال: ۱۶ جلسه تقریبی"
                value={values.approximateSessions || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="طول دوره (ساعت)"
                name="totalHours"
                placeholder="مثال: ۴۸ ساعت"
                value={values.totalHours || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="روزهای برگزاری"
                name="scheduleDays"
                placeholder="مثال: شنبه و چهارشنبه"
                value={values.scheduleDays || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="شهریه مصوب هر نفر (تومان)"
                name="tuitionPerPerson"
                type="number"
                placeholder="مثال: 8500000"
                value={values.tuitionPerPerson || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="تاریخ شروع تقریبی"
                name="approximateStartDate"
                placeholder="مثال: ۱۵ آبان ۱۴۰۴"
                value={values.approximateStartDate || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                label="تاریخ پایان تقریبی"
                name="approximateEndDate"
                placeholder="مثال: ۳۰ دی ۱۴۰۴"
                value={values.approximateEndDate || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <Textarea
              label="رویداد پایانی و ژوژمان (دعوت از اولیاء و داوری اساتید)"
              name="joujmanEvent.description"
              rows={3}
              value={
                values.joujmanEvent?.description ||
                "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود."
              }
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="توضیحات جلسه رسمی ارائه پروژه‌ها، ژوژمان و دعوت از والدین..."
            />

            <CourseSprintsSection
              title="سرفصل‌ها و اسپرینت‌های کارگاهی"
              subtitle="تعریف اسپرینت‌ها و سرفصل‌های کارگاه حضوری"
              emptyMessage="هنوز اسپرینتی برای این کارگاه ثبت نشده است. با زدن دکمه زیر می‌توانید اسپرینت جدید اضافه کنید."
            />

            <CourseSessionsManager
              mode={mode}
              courseId={courseId}
              sessions={formik.values.sessions || []}
              onChange={(newSessions) => formik.setFieldValue("sessions", newSessions)}
              errors={formik.errors}
              touched={formik.touched}
            />

            <InPersonLocationSection />
          </div>

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

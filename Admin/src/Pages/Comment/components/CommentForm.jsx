import React from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
} from "../../../Components/UI";
import Loading from "../../../Components/Loading";
import AvatarSelector from "./AvatarSelector";

export default function CommentForm({
  formik,
  courses = [],
  loadingCourses = false,
  isSubmitting = false,
  submitLabel = "ثبت نظر",
}) {
  const courseOptions = courses.map((c) => ({
    value: c._id,
    label: `${c.title} (${c.displayType || (c.courseModel === "VirtualCourse" ? "مجازی" : "حضوری")})`,
  }));

  return (
    <form onSubmit={formik.handleSubmit} className="w-full max-w-4xl mx-auto">
      <Card className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 shadow-xs">
        {/* Course selection */}
        <div>
          {loadingCourses ? (
            <div className="flex items-center gap-2 text-text-muted text-xs p-3">
              <Loading size={5} />
              <span>در حال بارگذاری دوره‌های آموزشی...</span>
            </div>
          ) : (
            <Select
              label="دوره آموزشی مرتبط"
              name="course"
              options={courseOptions}
              value={formik.values.course}
              onChange={(e) => {
                const selectedId = e?.target?.value !== undefined ? e.target.value : e;
                formik.setFieldValue("course", selectedId);
                const matched = courses.find((c) => c._id === selectedId);
                if (matched?.courseModel) {
                  formik.setFieldValue("courseModel", matched.courseModel);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.course && formik.errors.course}
              placeholder="انتخاب دوره آموزشی (حضوری یا مجازی)..."
            />
          )}
        </div>

        {/* Commenter info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="نام و نام خانوادگی نویسنده"
            name="name"
            placeholder="مثال: رضا صادقی"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            label="نقش / عنوان دوره"
            name="role"
            placeholder="مثال: هنرجوی دوره گرافیک"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && formik.errors.role}
          />

          <Input
            label="شغل یا موقعیت فعلی (اختیاری)"
            name="job"
            placeholder="مثال: طراح رابط کاربری"
            value={formik.values.job}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.job && formik.errors.job}
          />
        </div>

        {/* Comment body */}
        <Textarea
          label="متن نظر یا رضایت‌نامه"
          name="comment"
          rows={4}
          placeholder="متن نظر یا تجربه دانشجو در طول برگزاری دوره..."
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.comment && formik.errors.comment}
        />

        {/* Avatar selector */}
        <div className="pt-2 border-t border-border/80">
          <AvatarSelector
            selectedAvatar={formik.values.img}
            onSelect={(imgVal) => formik.setFieldValue("img", imgVal)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-border/80">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {submitLabel}
          </Button>
        </div>
      </Card>
    </form>
  );
}

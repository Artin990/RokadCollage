import React, { useState } from "react";
import { useFormikContext, FieldArray } from "formik";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Input, Textarea } from "../../../../Components/UI";

export default function CourseDescriptionSection() {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (pushFn) => {
    if (tagInput.trim() && !values.tags.includes(tagInput.trim())) {
      pushFn(tagInput.trim());
      setTagInput("");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tags FieldArray */}
      <FieldArray name="tags">
        {({ push, remove }) => (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary">
              تگ‌های دوره (برچسب‌ها)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="تایپ کنید و اینتر بزنید (مثال: فرانت‌اند)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(push);
                  }
                }}
              />
              <Button
                type="button"
                variant="primary-subtle"
                size="md"
                icon={<AddIcon fontSize="small" />}
                onClick={() => handleAddTag(push)}
              >
                افزودن تگ
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 min-h-[36px] p-2.5 bg-bg-light/60 rounded-xl border border-border/60">
              {values.tags && values.tags.length > 0 ? (
                values.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 bg-surface text-secondary px-3 py-1 rounded-xl text-xs font-semibold border border-border shadow-2xs"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-text-muted hover:text-error transition-colors cursor-pointer"
                      title="حذف تگ"
                    >
                      <CloseIcon style={{ fontSize: "0.9rem" }} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-muted self-center">
                  هنوز تگی اضافه نشده است. تگ‌های دوره به جستجوی بهتر کمک می‌کنند.
                </span>
              )}
            </div>
          </div>
        )}
      </FieldArray>

      {/* Description Textarea */}
      <Textarea
        label="توضیحات دوره"
        rows={4}
        placeholder="توضیحات جامع درباره سرفصل‌ها و مباحث آموزشی این دوره..."
        name="description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description && errors.description}
      />
    </div>
  );
}

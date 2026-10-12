import React, { useState } from "react";
import { useFormikContext, FieldArray } from "formik";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Input, Textarea } from "../../../Components/UI";

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
    <div className="flex flex-col gap-5 border-t border-border/80 pt-5">
      {/* Description */}
      <Textarea
        label="توضیحات و معرفی دوره"
        name="description"
        placeholder="توضیحات کامل درباره مباحث دوره، پیش‌نیازها و دستاوردهای دانشجو..."
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={4}
        error={touched.description && errors.description}
        required
      />

      {/* Tags FieldArray */}
      <FieldArray name="tags">
        {({ push, remove }) => (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">
              برچسب‌ها و تگ‌های دوره
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="تگ جدید را وارد کنید و افزودن را بزنید..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(push);
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                icon={<AddIcon fontSize="small" />}
                onClick={() => handleAddTag(push)}
              >
                افزودن تگ
              </Button>
            </div>

            {/* Display tags */}
            {values.tags && values.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface rounded-xl text-xs font-semibold text-text-secondary border border-border shadow-2xs"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-text-muted hover:text-danger cursor-pointer transition-colors"
                    >
                      <CloseIcon style={{ fontSize: "14px" }} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
}

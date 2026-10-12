import React from "react";
import { useFormikContext, FieldArray } from "formik";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, Input, Textarea } from "../../../Components/UI";

export default function CourseSprintsSection({
  title = "سرفصل‌ها و اسپرینت‌های دوره",
  subtitle = "تعریف اسپرینت‌ها و سرفصل‌های آموزشی دوره",
  emptyMessage = "هنوز اسپرینتی برای این دوره ثبت نشده است. با زدن دکمه زیر می‌توانید اسپرینت جدید اضافه کنید.",
}) {
  const { values, errors, touched, handleChange } = useFormikContext();

  return (
    <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-secondary">{title}</h4>
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>

      <FieldArray name="sprints">
        {({ push, remove }) => (
          <div className="flex flex-col gap-4 pt-1">
            {values.sprints && values.sprints.length > 0 ? (
              values.sprints.map((sprint, index) => (
                <div
                  key={index}
                  className="p-4 bg-surface rounded-xl border border-border flex flex-col gap-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      اسپرینت {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={<DeleteOutlineIcon fontSize="small" />}
                      onClick={() => remove(index)}
                      title="حذف اسپرینت"
                    />
                  </div>

                  <Input
                    label="عنوان اسپرینت"
                    name={`sprints.${index}.title`}
                    placeholder="مثال: آشنایی با مبانی و معماری..."
                    value={sprint.title || ""}
                    onChange={handleChange}
                    error={
                      touched.sprints?.[index]?.title &&
                      errors.sprints?.[index]?.title
                    }
                    required
                  />

                  <Textarea
                    label="توضیحات و سرفصل‌های این بخش"
                    name={`sprints.${index}.description`}
                    placeholder="توضیحات مباحثی که در این اسپرینت تدریس می‌شود..."
                    value={sprint.description || ""}
                    onChange={handleChange}
                    rows={2}
                    error={
                      touched.sprints?.[index]?.description &&
                      errors.sprints?.[index]?.description
                    }
                    required
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-border rounded-xl text-xs text-text-muted">
                {emptyMessage}
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<AddIcon fontSize="small" />}
              className="self-start mt-1"
              onClick={() => push({ title: "", description: "" })}
            >
              افزودن اسپرینت جدید
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}

import React from "react";
import { useFormikContext, FieldArray } from "formik";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, Input, Textarea } from "../../../../Components/UI";

export default function CourseSprintsSection({
  title = "سرفصل‌ها و اسپرینت‌های دوره",
  subtitle = "تعریف اسپرینت‌ها و سرفصل‌های آموزشی دوره",
  emptyMessage = "هنوز اسپرینتی برای این دوره ثبت نشده است. با زدن دکمه زیر می‌توانید اسپرینت جدید اضافه کنید.",
}) {
  const { values, errors, touched, handleChange } = useFormikContext();

  return (
    <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h3 className="font-bold text-secondary text-base">{title}</h3>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <FieldArray name="sprints">
        {({ push, remove }) => (
          <div className="flex flex-col gap-4">
            {values.sprints && values.sprints.length > 0 ? (
              values.sprints.map((sprint, index) => (
                <div
                  key={index}
                  className="bg-surface rounded-xl p-4 border border-border flex flex-col gap-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-lg border border-primary-border">
                      اسپرینت {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="danger-ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      title="حذف این اسپرینت"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </Button>
                  </div>

                  <Input
                    label="عنوان اسپرینت"
                    placeholder="مثال: مبانی عمیق جاوااسکریپت و الگوهای مدرن"
                    value={sprint.title || ""}
                    onChange={handleChange}
                    name={`sprints[${index}].title`}
                    error={
                      touched.sprints?.[index]?.title &&
                      errors.sprints?.[index]?.title
                    }
                  />

                  <Textarea
                    label="توضیحات اسپرینت"
                    rows={3}
                    placeholder="توضیحات جامع درباره مباحث این اسپرینت..."
                    value={sprint.description || ""}
                    onChange={handleChange}
                    name={`sprints[${index}].description`}
                    error={
                      touched.sprints?.[index]?.description &&
                      errors.sprints?.[index]?.description
                    }
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-border rounded-xl text-text-muted text-xs">
                {emptyMessage}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<AddIcon fontSize="small" />}
              onClick={() => push({ title: "", description: "" })}
              className="self-start"
            >
              افزودن اسپرینت جدید
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}

import React from "react";
import { useFormikContext, FieldArray } from "formik";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { Button, Input, JalaliDatePicker } from "../../../Components/UI";

export default function CourseDiscountSection({ onToggleRemoteCode, togglingCodeId }) {
  const { values, errors, touched, handleChange, setFieldValue } = useFormikContext();

  const basePriceNum = Number(values.price) || 0;
  const timedPctNum = Number(values.timedDiscount?.percentage) || 0;
  const finalPriceWithTimed =
    timedPctNum > 0
      ? Math.round(basePriceNum * (1 - timedPctNum / 100))
      : basePriceNum;

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Timed General Discount */}
      <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <LocalOfferIcon fontSize="small" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-secondary">
              تخفیف عمومی زمان‌دار (برای همه کاربران)
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              در صورت تنظیم درصد، قیمت اصلی خط خورده و قیمت نهایی تخفیف‌خورده به کاربران نمایش داده می‌شود.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Input
            label="درصد تخفیف عمومی (۰ تا ۱۰۰)"
            name="timedDiscount.percentage"
            type="number"
            min="0"
            max="100"
            placeholder="مثال: ۲۰"
            value={values.timedDiscount?.percentage ?? ""}
            onChange={handleChange}
            error={
              touched.timedDiscount?.percentage &&
              errors.timedDiscount?.percentage
            }
          />

          <JalaliDatePicker
            label="تاریخ شروع تخفیف"
            value={values.timedDiscount?.startDate || ""}
            onChange={(val) => setFieldValue("timedDiscount.startDate", val)}
            error={
              touched.timedDiscount?.startDate &&
              errors.timedDiscount?.startDate
            }
          />

          <JalaliDatePicker
            label="تاریخ پایان تخفیف"
            value={values.timedDiscount?.endDate || ""}
            onChange={(val) => setFieldValue("timedDiscount.endDate", val)}
            error={
              touched.timedDiscount?.endDate &&
              errors.timedDiscount?.endDate
            }
          />
        </div>

        {/* Real-time Calculation Preview */}
        {basePriceNum > 0 && timedPctNum > 0 && (
          <div className="bg-surface/80 rounded-xl p-3 border border-border flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-text-muted">پیش‌نمایش قیمت با تخفیف عمومی:</span>
            <div className="flex items-center gap-2 font-bold">
              <span className="line-through text-text-muted">
                {basePriceNum.toLocaleString("fa-IR")} تومان
              </span>
              <span className="text-primary font-black text-sm">
                {finalPriceWithTimed.toLocaleString("fa-IR")} تومان
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 font-black">
                {timedPctNum}٪ تخفیف
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Specific Discount Codes */}
      <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
              <ConfirmationNumberIcon fontSize="small" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-secondary">
                کدهای تخفیف اختصاصی دوره
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                تعریف کوپن‌های تخفیف اختصاصی با تاریخ انقضا و امکان فعال/غیرفعال‌سازی سریع
              </p>
            </div>
          </div>
        </div>

        <FieldArray name="discountCodes">
          {({ push, remove }) => (
            <div className="flex flex-col gap-4 pt-1">
              {values.discountCodes && values.discountCodes.length > 0 ? (
                values.discountCodes.map((codeItem, index) => (
                  <div
                    key={codeItem._id || index}
                    className="p-4 bg-surface rounded-xl border border-border flex flex-col gap-3 shadow-2xs"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        label="کد تخفیف (کوپن)"
                        name={`discountCodes.${index}.code`}
                        placeholder="مثال: NOROOZ1403"
                        value={codeItem.code || ""}
                        onChange={handleChange}
                        error={
                          touched.discountCodes?.[index]?.code &&
                          errors.discountCodes?.[index]?.code
                        }
                        required
                      />

                      <Input
                        label="عنوان / مناسبت"
                        name={`discountCodes.${index}.title`}
                        placeholder="مثال: جشنواره عیدانه"
                        value={codeItem.title || ""}
                        onChange={handleChange}
                        error={
                          touched.discountCodes?.[index]?.title &&
                          errors.discountCodes?.[index]?.title
                        }
                      />

                      <Input
                        label="درصد تخفیف"
                        name={`discountCodes.${index}.percentage`}
                        type="number"
                        min="1"
                        max="100"
                        placeholder="مثال: ۳۰"
                        value={codeItem.percentage ?? ""}
                        onChange={handleChange}
                        error={
                          touched.discountCodes?.[index]?.percentage &&
                          errors.discountCodes?.[index]?.percentage
                        }
                        required
                      />

                      <div className="flex items-end gap-2">
                        {/* Toggle Active Button */}
                        <Button
                          type="button"
                          variant={codeItem.isActive !== false ? "success" : "secondary"}
                          size="md"
                          className="flex-1 text-xs"
                          loading={togglingCodeId === codeItem._id}
                          onClick={() => {
                            if (codeItem._id && onToggleRemoteCode) {
                              onToggleRemoteCode(codeItem._id);
                            } else {
                              setFieldValue(
                                `discountCodes.${index}.isActive`,
                                codeItem.isActive === false
                              );
                            }
                          }}
                        >
                          {codeItem.isActive !== false ? (
                            <span className="flex items-center gap-1">
                              <ToggleOnIcon /> فعال
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ToggleOffIcon /> غیرفعال
                            </span>
                          )}
                        </Button>

                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="danger"
                          size="md"
                          icon={<DeleteOutlineIcon fontSize="small" />}
                          onClick={() => remove(index)}
                          title="حذف کد تخفیف"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-border/50">
                      <JalaliDatePicker
                        label="تاریخ شروع اعتبار"
                        value={codeItem.startDate || ""}
                        onChange={(val) =>
                          setFieldValue(`discountCodes.${index}.startDate`, val)
                        }
                      />
                      <JalaliDatePicker
                        label="تاریخ پایان اعتبار"
                        value={codeItem.endDate || ""}
                        onChange={(val) =>
                          setFieldValue(`discountCodes.${index}.endDate`, val)
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-border rounded-xl text-xs text-text-muted">
                  هنوز هیچ کد تخفیفی برای این دوره تعریف نشده است.
                </div>
              )}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<AddIcon fontSize="small" />}
                className="self-stretch sm:self-start mt-1 justify-center"
                onClick={() =>
                  push({
                    code: "",
                    title: "",
                    percentage: "",
                    startDate: null,
                    endDate: null,
                    isActive: true,
                  })
                }
              >
                افزودن کد تخفیف جدید
              </Button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
}

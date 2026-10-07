import React from "react";
import { useFormikContext, FieldArray } from "formik";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { Button, Input, JalaliDatePicker } from "../../../../Components/UI";

export default function CourseDiscountSection({ onToggleRemoteCode, togglingCodeId }) {
  const { values, errors, touched, handleChange, setFieldValue } = useFormikContext();

  const basePriceNum = Number(values.price) || 0;
  const timedPctNum = Number(values.timedDiscount?.percentage) || 0;
  const timedDiscountVal = Math.round((basePriceNum * timedPctNum) / 100);
  const timedFinalPrice = Math.max(0, basePriceNum - timedDiscountVal);

  return (
    <div className="flex flex-col gap-5 p-5 bg-surface rounded-2xl border border-border shadow-xs">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <LocalOfferIcon className="text-primary" fontSize="small" />
        <h3 className="font-bold text-secondary text-sm md:text-base">
          سیستم تخفیف‌های دوره (اختیاری)
        </h3>
      </div>

      {/* 1. Timed discount (no code required) */}
      <div className="p-4 bg-bg-light/40 rounded-xl border border-border flex flex-col gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h4 className="font-bold text-secondary text-sm">
              تخفیف زمان‌دار (بدون کد)
            </h4>
          </div>
          {basePriceNum > 0 && timedPctNum > 0 && (
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              قیمت پس از تخفیف: {timedFinalPrice.toLocaleString("fa-IR")} تومان
            </span>
          )}
        </div>

        <div className="p-4 rounded-xl border border-border bg-white shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="درصد تخفیف (۰ تا ۱۰۰)"
              type="number"
              min="0"
              max="100"
              placeholder="مثال: ۲۰"
              name="timedDiscount.percentage"
              value={values.timedDiscount?.percentage ?? ""}
              onChange={handleChange}
              error={
                touched.timedDiscount?.percentage &&
                errors.timedDiscount?.percentage
              }
            />

            <JalaliDatePicker
              label="تاریخ شروع تخفیف"
              placeholder="انتخاب تاریخ شروع"
              value={values.timedDiscount?.startDate || null}
              onChange={(val) => setFieldValue("timedDiscount.startDate", val)}
              error={
                touched.timedDiscount?.startDate &&
                errors.timedDiscount?.startDate
              }
            />

            <JalaliDatePicker
              label="تاریخ پایان تخفیف"
              placeholder="انتخاب تاریخ پایان"
              value={values.timedDiscount?.endDate || null}
              onChange={(val) => setFieldValue("timedDiscount.endDate", val)}
              error={
                touched.timedDiscount?.endDate &&
                errors.timedDiscount?.endDate
              }
            />
          </div>
        </div>
      </div>

      {/* 2. Discount coupon codes */}
      <div className="p-4 bg-bg-light/40 rounded-xl border border-border flex flex-col gap-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <ConfirmationNumberIcon className="text-primary" fontSize="small" />
          <h4 className="font-bold text-secondary text-sm">
            کدهای تخفیف اختصاصی دوره
          </h4>
        </div>

        <FieldArray name="discountCodes">
          {({ push, remove }) => (
            <div className="flex flex-col gap-3">
              {values.discountCodes && values.discountCodes.length > 0 ? (
                values.discountCodes.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="p-4 rounded-xl border border-border bg-white shadow-2xs flex flex-col gap-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <Input
                        label="کد تخفیف (انگلیسی)"
                        placeholder="مثال: NOWRUZ"
                        name={`discountCodes[${idx}].code`}
                        value={item.code}
                        onChange={handleChange}
                      />

                      <Input
                        label="عنوان کد (اختیاری)"
                        placeholder="مثال: تخفیف عید نوروز"
                        name={`discountCodes[${idx}].title`}
                        value={item.title}
                        onChange={handleChange}
                      />

                      <Input
                        label="درصد تخفیف"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="مثال: ۲۵"
                        name={`discountCodes[${idx}].percentage`}
                        value={item.percentage}
                        onChange={handleChange}
                      />

                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-6">
                        {item._id && onToggleRemoteCode && (
                          <button
                            type="button"
                            onClick={() => onToggleRemoteCode(item._id)}
                            disabled={togglingCodeId === item._id}
                            className="cursor-pointer text-xs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all"
                            title={item.isActive ? "غیرفعال‌سازی کد" : "فعال‌سازی کد"}
                          >
                            {item.isActive ? (
                              <>
                                <ToggleOnIcon className="text-emerald-600" />
                                <span className="text-emerald-700">فعال</span>
                              </>
                            ) : (
                              <>
                                <ToggleOffIcon className="text-rose-500" />
                                <span className="text-rose-600">غیرفعال</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="cursor-pointer p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="حذف کد تخفیف"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <JalaliDatePicker
                        label="تاریخ شروع اعتبار"
                        value={item.startDate || null}
                        onChange={(val) => setFieldValue(`discountCodes[${idx}].startDate`, val)}
                      />
                      <JalaliDatePicker
                        label="تاریخ انقضای اعتبار"
                        value={item.endDate || null}
                        onChange={(val) => setFieldValue(`discountCodes[${idx}].endDate`, val)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-text-muted p-3 bg-white rounded-xl border border-dashed border-border text-center">
                  هنوز هیچ کد تخفیفی برای این دوره افزوده نشده است.
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
                  icon={<AddIcon fontSize="small" />}
                >
                  افزودن کد تخفیف جدید
                </Button>
              </div>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
}

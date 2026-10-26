import React from "react";
import { useFormikContext } from "formik";
import { Input } from "../../../../Components/UI";

export const sanitizeEmbedUrl = (input) => {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : trimmed;
};

export default function InPersonLocationSection() {
  const { values, handleChange, setFieldValue } = useFormikContext();

  const handleUrlBlur = (fieldName) => (e) => {
    const raw = e.target.value;
    const sanitized = sanitizeEmbedUrl(raw);
    if (sanitized !== raw) {
      setFieldValue(fieldName, sanitized);
    }
  };

  return (
    <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
      <div className="pb-3 border-b border-border/60">
        <h3 className="font-bold text-secondary text-base">
          موقعیت مکانی و نقشه‌ها
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          آدرس محل برگزاری کارگاه حضوری به همراه لینک و کدهای embed نقشه‌ها
        </p>
      </div>

      <Input
        label="آدرس محل برگزاری"
        placeholder="مثال: مشهد - فرامرز عباسی ۳۳"
        name="location.address"
        value={values.location?.address || ""}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
        <div>
          <h4 className="text-xs font-bold text-secondary">
            موقعیت آنلاین در نقشه‌ها (گوگل مپ، نشان و بلد)
          </h4>
          <p className="text-[11px] text-text-muted mt-0.5">
            می‌توانید لینک اشتراک‌گذاری یا کد کامل &lt;iframe&gt; هر یک یا هر سه نقشه را وارد کنید:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              label="نقشه گوگل (Google Maps)"
              placeholder="کد <iframe> یا لینک اشتراک‌گذاری گوگل مپ"
              name="location.googleMapEmbedUrl"
              value={values.location?.googleMapEmbedUrl || ""}
              onChange={handleChange}
              onBlur={handleUrlBlur("location.googleMapEmbedUrl")}
            />
            <span className="text-[10px] text-text-muted">
              پشتیبانی از iframe یا لینک google.com/maps
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="نقشه نشان (Neshan)"
              placeholder="کد <iframe> یا لینک نشان"
              name="location.neshanEmbedUrl"
              value={values.location?.neshanEmbedUrl || ""}
              onChange={handleChange}
              onBlur={handleUrlBlur("location.neshanEmbedUrl")}
            />
            <span className="text-[10px] text-text-muted">
              پشتیبانی از iframe یا لینک neshan.org / nshn.ir
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label="نقشه بلد (Balad)"
              placeholder="کد <iframe> یا لینک بلد"
              name="location.baladEmbedUrl"
              value={values.location?.baladEmbedUrl || ""}
              onChange={handleChange}
              onBlur={handleUrlBlur("location.baladEmbedUrl")}
            />
            <span className="text-[10px] text-text-muted">
              پشتیبانی از iframe یا لینک balad.ir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

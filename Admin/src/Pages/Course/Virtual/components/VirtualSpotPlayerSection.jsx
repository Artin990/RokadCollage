import React from "react";
import { useFormikContext } from "formik";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Input } from "../../../../Components/UI";

export default function VirtualSpotPlayerSection() {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext();

  return (
    <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border/60">
        <VpnKeyIcon className="text-primary" fontSize="small" />
        <div>
          <h3 className="font-bold text-secondary text-base">
            اتصال به وب‌سرویس SpotPlayer
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            شناسه دوره تعریف‌شده در پنل اسپات‌پلیر جهت صدور خودکار لایسنس دانشجویان
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="شناسه دوره در اسپات‌پلیر (SpotPlayer Course ID)"
          placeholder="مثال: 5e07663489269e0b84c8a8e1"
          name="spotplayerCourseId"
          value={values.spotplayerCourseId || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.spotplayerCourseId && errors.spotplayerCourseId}
          dir="ltr"
          className="font-mono text-left"
        />

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-800 leading-relaxed mt-1">
          <InfoOutlinedIcon fontSize="small" className="text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>راهنمای دریافت شناسه:</strong> وارد پنل اسپات‌پلیر شوید، به بخش «دوره‌ها» بروید، روی دوره مورد نظر کلیک کرده و شناسه ۲۴ کاراکتری هگزادسیمال آن را کپی کرده و در این کادر قرار دهید. لایسنس هر دانشجو پس از ثبت‌نام به این شناسه متصل خواهد شد.
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Card } from "../../../../Components/UI";

const isSafeHttpUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export default function SingleCourseLocation({ location }) {
  const [selectedMapId, setSelectedMapId] = useState("");

  const rawSources = [];

  if (isSafeHttpUrl(location?.googleMapEmbedUrl)) {
    rawSources.push({
      id: "google",
      name: "گوگل مپ (Google Maps)",
      badge: "گوگل مپ",
      url: location.googleMapEmbedUrl,
    });
  } else if (isSafeHttpUrl(location?.mapEmbedUrl) && /google\.com/i.test(location.mapEmbedUrl)) {
    rawSources.push({
      id: "google",
      name: "گوگل مپ (Google Maps)",
      badge: "گوگل مپ",
      url: location.mapEmbedUrl,
    });
  }

  if (isSafeHttpUrl(location?.neshanEmbedUrl)) {
    rawSources.push({
      id: "neshan",
      name: "نشان (Neshan)",
      badge: "نشان",
      url: location.neshanEmbedUrl,
    });
  } else if (isSafeHttpUrl(location?.mapEmbedUrl) && /neshan\.org|nshn\.ir/i.test(location.mapEmbedUrl)) {
    rawSources.push({
      id: "neshan",
      name: "نشان (Neshan)",
      badge: "نشان",
      url: location.mapEmbedUrl,
    });
  }

  if (isSafeHttpUrl(location?.baladEmbedUrl)) {
    rawSources.push({
      id: "balad",
      name: "بلد (Balad)",
      badge: "بلد",
      url: location.baladEmbedUrl,
    });
  } else if (isSafeHttpUrl(location?.mapEmbedUrl) && /balad\.ir/i.test(location.mapEmbedUrl)) {
    rawSources.push({
      id: "balad",
      name: "بلد (Balad)",
      badge: "بلد",
      url: location.mapEmbedUrl,
    });
  }

  if (rawSources.length === 0 && isSafeHttpUrl(location?.mapEmbedUrl)) {
    rawSources.push({
      id: "general",
      name: "نقشه آنلاین",
      badge: "نقشه",
      url: location.mapEmbedUrl,
    });
  }

  const mapSources = rawSources;
  const activeMap = mapSources.find((m) => m.id === selectedMapId) || mapSources[0];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-1">
        <span className="w-2.5 h-6 rounded-full bg-primary" />
        <h3 className="text-lg md:text-xl font-bold text-secondary">
          موقعیت مکانی کارگاه
        </h3>
      </div>

      <Card className="p-6 md:p-8 border border-border shadow-xs flex flex-col gap-6">
        {/* Address */}
        <div className="bg-bg-light/50 rounded-xl p-4 border border-border/80 flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-muted">آدرس محل برگزاری</span>
          <p className="text-sm md:text-base font-semibold text-secondary leading-relaxed">
            {location?.address || "آدرس کارگاه به زودی درج خواهد شد."}
          </p>
        </div>

        {/* Multi-Provider Secure Map Embed & Links */}
        {mapSources.length === 0 ? (
          <div className="text-center py-8 bg-bg-light/30 rounded-2xl border border-dashed border-border text-text-muted text-xs md:text-sm">
            نقشه آنلاین برای این دوره تنظیم نشده است.
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {/* Map Selector Tabs */}
            {mapSources.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/60">
                <span className="text-xs font-semibold text-text-muted me-1">
                  انتخاب سرویس نقشه:
                </span>
                {mapSources.map((map) => {
                  const isActive = activeMap.id === map.id;
                  return (
                    <button
                      key={map.id}
                      type="button"
                      onClick={() => setSelectedMapId(map.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                        isActive
                          ? "bg-primary text-secondary border-primary shadow-xs"
                          : "bg-surface text-text-secondary border-border hover:bg-surface-hover"
                      }`}
                    >
                      {map.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Map Iframe */}
            <div className="relative w-full h-72 md:h-84 rounded-2xl overflow-hidden border border-border/80 bg-bg-light shadow-2xs">
              <iframe
                key={activeMap.url}
                src={activeMap.url}
                title={`موقعیت مکانی در ${activeMap.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Direct Navigation Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
              <span className="text-xs text-text-muted">
                مسیریابی مستقیم در اپلیکیشن‌های نقشه:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {mapSources.map((map) => (
                  <a
                    key={map.id}
                    href={map.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline py-1"
                  >
                    <span>مسیریابی در {map.badge}</span>
                    <OpenInNewIcon style={{ fontSize: "0.95rem" }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

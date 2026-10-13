"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PanelRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "profile") {
      router.replace("/profile");
    } else {
      router.replace("/my-courses");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center font-bold text-stone-500">
      در حال انتقال...
    </div>
  );
}

export default function PanelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center font-bold text-stone-500">
          در حال انتقال...
        </div>
      }
    >
      <PanelRedirect />
    </Suspense>
  );
}

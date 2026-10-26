import { useState, useEffect } from "react";
import { Bookmark, UserPlus, X } from "lucide-react";

export default function AuthPromptToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("لطفاً ابتدا وارد حساب کاربری شوید.");

  useEffect(() => {
    let timer = null;
    const handler = (e) => {
      const msg = e.detail?.message || "لطفاً ابتدا وارد حساب کاربری شوید.";
      setMessage(msg);
      setVisible(true);

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    window.addEventListener("rokad_auth_required", handler);
    return () => {
      window.removeEventListener("rokad_auth_required", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  const handleGoRegister = () => {
    try {
      sessionStorage.setItem("rokad_auth_msg", message);
      sessionStorage.setItem("rokad_auth_redirect", window.location.hash.replace(/^#/, "") || "courses-index");
    } catch (_) {}
    setVisible(false);
    window.location.hash = "#auth/register";
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: "fixed",
        bottom: 24,
        right: "50%",
        transform: "translateX(50%)",
        zIndex: 99999,
        maxWidth: "92vw",
        width: 440,
        background: "#FFFDF7",
        border: "2px solid var(--ink, #18181B)",
        borderRadius: 14,
        padding: "12px 16px",
        boxShadow: "4px 4px 0 var(--ink, #18181B)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        animation: "authToastSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fontFamily: "inherit",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "#FFF0D4",
            border: "1.5px solid var(--ink, #18181B)",
            boxShadow: "2px 2px 0 var(--ink, #18181B)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: "#B45309",
          }}
        >
          <Bookmark size={18} strokeWidth={2.4} fill="#FDE68A" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--ink, #18181B)", lineHeight: 1.4 }}>
            {message}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button
          type="button"
          onClick={handleGoRegister}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--accent, #F8A41D)",
            color: "var(--ink, #18181B)",
            border: "1.8px solid var(--ink, #18181B)",
            borderRadius: 8,
            padding: "7px 12px",
            fontSize: "12.5px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "2px 2px 0 var(--ink, #18181B)",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-1px, -1px)";
            e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink, #18181B)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "2px 2px 0 var(--ink, #18181B)";
          }}
        >
          <UserPlus size={14} strokeWidth={2.4} />
          <span>ثبت‌نام</span>
        </button>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="بستن پیام"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--ink-subtle, #71717A)",
            cursor: "pointer",
            padding: 4,
            display: "grid",
            placeItems: "center",
            borderRadius: 6,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink, #18181B)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-subtle, #71717A)"; }}
        >
          <X size={17} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

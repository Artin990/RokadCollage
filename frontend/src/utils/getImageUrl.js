// ==========================================
// Image URL Resolver for Frontend
// Handles backend uploads, absolute URLs, and fallback assets
// ==========================================

export function getCourseImageUrl(imagePath, fallback = "/assets/StatCard/blue.png") {
  if (!imagePath) return fallback;

  const trimmed = String(imagePath).trim();
  if (!trimmed) return fallback;

  // 1. External or base64 / blob URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // 2. Local frontend public assets (/assets/..., /default-..., etc.)
  if (
    trimmed.startsWith("/assets/") ||
    trimmed.startsWith("/images/") ||
    trimmed.startsWith("/fonts/") ||
    trimmed.startsWith("/default-")
  ) {
    return trimmed;
  }

  // 3. Backend uploads
  const clean = trimmed.replace(/^\/+/, "").replace(/^(Public|uploads)\/+/i, "");

  if (process.env.NEXT_PUBLIC_FILE_URL) {
    return `${process.env.NEXT_PUBLIC_FILE_URL}/${clean}`.replace(/([^:]\/)\/+/g, "$1");
  }

  if (typeof window !== "undefined") {
    if (window.location.port === "3000" || (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")) {
      return `/${clean}`;
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
      : "http://localhost:5000";

  return `${baseUrl}/${clean}`.replace(/([^:]\/)\/+/g, "$1");
}

export function isCustomImage(imagePath) {
  if (!imagePath) return false;
  const s = String(imagePath).trim();
  if (!s) return false;
  if (s.startsWith("/assets/StatCard/")) return false;
  return true;
}

export default getCourseImageUrl;

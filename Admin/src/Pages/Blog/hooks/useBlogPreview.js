import { useState, useRef, useCallback, useEffect } from "react";
import { previewBlogContent } from "../api/blogApi";

/**
 * Custom hook to fetch and cache sanitized blog HTML preview from server.
 * Ensures cancellation of in-flight requests and avoids duplicate requests.
 */
export default function useBlogPreview() {
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [html, setHtml] = useState("");
  const [error, setError] = useState(null);
  const [lastPreviewedContent, setLastPreviewedContent] = useState(null);

  // Cache: contentString -> sanitizedHtmlString
  const cacheRef = useRef(new Map());
  // Abort controller reference for ongoing request
  const abortControllerRef = useRef(null);

  const cancelPendingRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchPreview = useCallback(
    async (content) => {
      const trimmedContent = typeof content === "string" ? content.trim() : "";

      if (!trimmedContent) {
        cancelPendingRequest();
        setStatus("idle");
        setHtml("");
        setError(null);
        setLastPreviewedContent("");
        return;
      }

      // Check cache first
      if (cacheRef.current.has(trimmedContent)) {
        cancelPendingRequest();
        setStatus("success");
        setHtml(cacheRef.current.get(trimmedContent));
        setError(null);
        setLastPreviewedContent(trimmedContent);
        return;
      }

      cancelPendingRequest();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus("loading");
      setError(null);

      try {
        const response = await previewBlogContent(trimmedContent, controller.signal);

        if (response && response.success !== false && response.data?.html !== undefined) {
          const sanitizedHtml = response.data.html;
          cacheRef.current.set(trimmedContent, sanitizedHtml);
          setHtml(sanitizedHtml);
          setStatus("success");
          setError(null);
          setLastPreviewedContent(trimmedContent);
        } else {
          throw new Error(response?.message || "خطا در پردازش پیش‌نمایش محتوا");
        }
      } catch (err) {
        // Ignore aborted requests
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "خطا در دریافت پیش‌نمایش از سرور";
        setError(errorMsg);
        setStatus("error");
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [cancelPendingRequest]
  );

  useEffect(() => {
    return () => {
      cancelPendingRequest();
    };
  }, [cancelPendingRequest]);

  return {
    status,
    html,
    error,
    lastPreviewedContent,
    fetchPreview,
    cancelPendingRequest,
  };
}

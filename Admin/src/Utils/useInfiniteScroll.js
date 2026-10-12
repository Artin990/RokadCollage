import { useEffect, useRef } from "react";

/**
 * Robust, cross-device infinite scroll hook.
 * Correctly detects scroll on both inner <main> scroll container and window.
 */
export function useInfiniteScroll({
  onReachBottom,
  hasMore = true,
  isLoading = false,
  threshold = 180,
}) {
  const onReachBottomRef = useRef(onReachBottom);
  onReachBottomRef.current = onReachBottom;

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const scrollContainer = document.querySelector("main") || window;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        let scrollHeight, scrollTop, clientHeight;

        if (scrollContainer === window || !scrollContainer) {
          scrollHeight = document.documentElement.scrollHeight;
          scrollTop = document.documentElement.scrollTop || window.scrollY || 0;
          clientHeight = window.innerHeight;
        } else {
          scrollHeight = scrollContainer.scrollHeight;
          scrollTop = scrollContainer.scrollTop;
          clientHeight = scrollContainer.clientHeight;
        }

        if (scrollHeight - scrollTop <= clientHeight + threshold) {
          onReachBottomRef.current?.();
        }

        ticking = false;
      });

      ticking = true;
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isLoading, threshold]);
}

export default useInfiniteScroll;

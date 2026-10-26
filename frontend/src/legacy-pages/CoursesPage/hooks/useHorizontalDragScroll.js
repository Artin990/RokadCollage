import { useEffect, useRef, useState, useCallback } from "react";

export function useHorizontalDragScroll() {
  const [node, setNode] = useState(null);
  const rowRef = useRef(null);
  const [nav, setNav] = useState({ prev: false, next: false });
  const isDraggingRef = useRef(false);
  const dragInfoRef = useRef({ startX: 0, scrollLeft: 0, hasMoved: false });

  // Callback ref so hook works even when component mounts dynamically after data loading
  const refCallback = useCallback((el) => {
    rowRef.current = el;
    setNode(el);
  }, []);
  // Support both ref={scroll.rowRef} and ref object accesses
  refCallback.current = node;

  const getMetrics = useCallback((el) => {
    if (!el) return { max: 0, pos: 0 };
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const isRtl = getComputedStyle(el).direction === "rtl";
    if (!isRtl) {
      return { max, pos: Math.max(0, el.scrollLeft) };
    }
    // RTL handling: in standard modern browsers, scrollLeft in RTL is 0 at start and negative when scrolled.
    // In legacy browsers, it may be max down to 0.
    const raw = el.scrollLeft;
    if (raw <= 0) {
      return { max, pos: Math.min(max, Math.abs(raw)) };
    }
    if (raw <= max) {
      return { max, pos: Math.min(max, max - raw) };
    }
    return { max, pos: Math.min(max, Math.abs(raw)) };
  }, []);

  const update = useCallback(() => {
    const el = node || rowRef.current;
    if (!el) return;
    const { max, pos } = getMetrics(el);
    const threshold = 8;
    setNav({
      prev: pos > threshold,
      next: max > threshold && pos < max - threshold,
    });
  }, [node, getMetrics]);

  // Fallback to check if rowRef.current was populated directly as a ref object
  useEffect(() => {
    if (!node && rowRef.current) {
      setNode(rowRef.current);
    }
  });

  useEffect(() => {
    const el = node || rowRef.current;
    if (!el) return;

    update();

    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        update();
      });
      ro.observe(el);
      Array.from(el.children).forEach((child) => ro.observe(child));
    }

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      dragInfoRef.current = {
        startX: e.pageX,
        scrollLeft: el.scrollLeft,
        hasMoved: false,
      };
      el.classList.add("is-dragging");
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const delta = e.pageX - dragInfoRef.current.startX;
      if (Math.abs(delta) > 5) {
        dragInfoRef.current.hasMoved = true;
        e.preventDefault();
      }
      if (dragInfoRef.current.hasMoved) {
        el.scrollLeft = dragInfoRef.current.scrollLeft - delta;
      }
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      el.classList.remove("is-dragging");
      setTimeout(() => {
        if (dragInfoRef.current) {
          dragInfoRef.current.hasMoved = false;
        }
      }, 80);
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [node, update]);

  const scroll = useCallback((toNext) => {
    const el = node || rowRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const step = Math.max(300, Math.round(el.clientWidth * 0.75));
    // In RTL: next items are to the left (-step), previous items are to the right (+step)
    const delta = isRtl ? (toNext ? -step : step) : (toNext ? step : -step);

    el.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  }, [node]);

  return { rowRef: refCallback, nav, update, scroll };
}

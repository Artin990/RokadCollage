import React from "react";
import { getImageUrl } from "../../../Utils/getImageUrl";

/**
 * Secure Course Icon component.
 * Completely avoids `dangerouslySetInnerHTML` by rendering SVG markup as an image data URI,
 * neutralizing any potential script injection while preserving crisp vector rendering.
 *
 * @param {Object} props
 * @param {string} props.icon - SVG markup string or image filename
 * @param {string} [props.alt="آیکون دوره"]
 * @param {string} [props.className="w-full h-full object-contain"]
 */
export function CourseIcon({
  icon,
  alt = "آیکون دوره",
  className = "w-full h-full object-contain",
}) {
  if (!icon || typeof icon !== "string") {
    return null;
  }

  const trimmed = icon.trim();
  const isSvgMarkup = trimmed.startsWith("<");

  const imageSrc = isSvgMarkup
    ? `data:image/svg+xml;utf8,${encodeURIComponent(trimmed)}`
    : getImageUrl(trimmed);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

export default CourseIcon;

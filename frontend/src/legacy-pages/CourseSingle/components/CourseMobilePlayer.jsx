import React from "react";
import { Star as LucideStar } from "lucide-react";
import { PlayGlyph } from "./CoursePanels.jsx";
import { getCourseImageUrl } from "@/utils/getImageUrl.js";

export default function CourseMobilePlayer({ course, headRef, onOpenVideo }) {
  return (
    <div className="cs-player-col" ref={headRef}>
      <div
        className="cs-thumb cs-video"
        style={{ position: "relative", overflow: "hidden", background: "#000", cursor: "pointer" }}
        onClick={onOpenVideo}
      >
        <img
          src={getCourseImageUrl(course.img, course.pattern || "/assets/StatCard/blue.png")}
          alt={course.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <button
          type="button"
          className="play"
          onClick={(e) => {
            e.stopPropagation();
            onOpenVideo();
          }}
          aria-label="پخش ویدیو با پلیر پیشرفته"
        >
          <span><PlayGlyph /></span>
        </button>
      </div>

      <div className="cs-title-row">
        <h1>{course.title}</h1>
      </div>
    </div>
  );
}

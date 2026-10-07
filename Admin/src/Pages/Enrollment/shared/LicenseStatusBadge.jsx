import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SyncIcon from "@mui/icons-material/Sync";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Badge } from "../../../Components/UI";

/**
 * Renders a standardized Persian status badge for SpotPlayer licenses.
 *
 * @param {Object} props
 * @param {String} props.status - "pending" | "processing" | "issued" | "failed"
 */
export default function LicenseStatusBadge({ status = "pending" }) {
  switch (status) {
    case "issued":
      return (
        <Badge variant="success" size="sm" className="flex items-center gap-1 font-bold">
          <CheckCircleOutlineIcon style={{ fontSize: "0.9rem" }} />
          <span>صادر شد</span>
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="info" size="sm" className="flex items-center gap-1 font-bold">
          <SyncIcon className="animate-spin" style={{ fontSize: "0.9rem" }} />
          <span>در حال صدور</span>
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="error" size="sm" className="flex items-center gap-1 font-bold">
          <ErrorOutlineIcon style={{ fontSize: "0.9rem" }} />
          <span>ناموفق</span>
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge variant="amber" size="sm" className="flex items-center gap-1 font-bold">
          <HourglassEmptyIcon style={{ fontSize: "0.9rem" }} />
          <span>در انتظار</span>
        </Badge>
      );
  }
}

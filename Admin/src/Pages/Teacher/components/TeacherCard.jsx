import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Card, Badge, Button, IconButton } from "../../../Components/UI";

export default function TeacherCard({ teacher, onEdit, onDelete }) {
  const photoUrl = getImageUrl(teacher.photo);

  return (
    <Card hoverable className="overflow-hidden flex flex-col justify-between h-full group">
      <div className="p-5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 mb-4 bg-surface-muted shadow-xs">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={teacher.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
              بدون تصویر
            </div>
          )}
        </div>

        <h3 className="font-bold text-secondary text-base mb-1">
          {teacher.name}
        </h3>

        <div className="mt-1">
          <Badge variant="amber" size="sm">
            {teacher.specialization}
          </Badge>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-border flex items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          icon={<EditIcon fontSize="small" />}
          onClick={() => onEdit(teacher)}
        >
          ویرایش
        </Button>

        <IconButton
          variant="danger"
          size="sm"
          icon={<DeleteOutlineIcon fontSize="small" />}
          onClick={() => onDelete(teacher)}
          title="حذف استاد"
          aria-label="حذف استاد"
        />
      </div>
    </Card>
  );
}

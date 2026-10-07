import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../../Utils/axiosInstance";
import Notify from "../../Utils/notify";
import confirm from "../../Utils/confirm";
import Loading from "../Loading";
import { Button } from "../UI";
import CourseSessionRow from "./CourseSessionRow";

/**
 * Shared Course Sessions Manager component.
 * Used in both Course creation and Course edit views.
 */
export default function CourseSessionsManager({
  mode = "create",
  courseId,
  sessions: createSessions = [],
  onChange,
  errors = {},
  touched = {},
}) {
  const [updateSessions, setUpdateSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [savingSessionKey, setSavingSessionKey] = useState(null);

  const fetchUpdateSessions = async () => {
    if (!courseId) return;
    setLoadingSessions(true);
    try {
      const response = await axiosInstance.get(`in-person-courses/${courseId}/sessions`);
      if (response && response.data) {
        const sessionList = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setUpdateSessions(sessionList);
      }
    } catch (err) {
      console.error("Error fetching course sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (mode === "update" && courseId) {
      fetchUpdateSessions();
    }
  }, [mode, courseId]);

  const activeSessions = mode === "create" ? createSessions : updateSessions;

  const handleAddSession = () => {
    const nextIndex = activeSessions.length + 1;
    const defaultCode = `کد ${nextIndex}`;

    if (mode === "create") {
      const newSession = {
        code: defaultCode,
        scheduleDays: "",
        scheduleHours: "",
        capacity: "",
      };
      onChange([...createSessions, newSession]);
    } else {
      const newSession = {
        _id: null,
        tempId: Date.now() + Math.random(),
        code: defaultCode,
        scheduleDays: "",
        scheduleHours: "",
        capacity: "",
        enrolledCount: 0,
        isNew: true,
      };
      setUpdateSessions((prev) => [...prev, newSession]);
    }
  };

  const handleFieldChange = (indexOrKey, field, value) => {
    if (mode === "create") {
      const updated = createSessions.map((sess, idx) =>
        idx === indexOrKey ? { ...sess, [field]: value } : sess
      );
      onChange(updated);
    } else {
      setUpdateSessions((prev) =>
        prev.map((s) => {
          const matches = s._id ? s._id === indexOrKey : s.tempId === indexOrKey;
          return matches ? { ...s, [field]: value } : s;
        })
      );
    }
  };

  const handleDeleteSession = async (sessionOrIndex) => {
    if (activeSessions.length <= 1) {
      Notify.error("هر دوره حضوری باید حداقل یک کد کلاس داشته باشد");
      return;
    }

    if (mode === "create") {
      const index = sessionOrIndex;
      const updated = createSessions.filter((_, idx) => idx !== index);
      onChange(updated);
    } else {
      const session = sessionOrIndex;
      if (session.isNew) {
        setUpdateSessions((prev) => prev.filter((s) => s.tempId !== session.tempId));
        return;
      }

      const isConfirmed = await confirm(
        `آیا از حذف کد کلاس «${session.code}» اطمینان دارید؟`,
        "تمام سوابق این جلسه حذف خواهند شد.",
        "بله، حذف کن"
      );
      if (!isConfirmed) return;

      try {
        const res = await axiosInstance.delete(`in-person-courses/${courseId}/sessions/${session._id}`);
        if (res && res.success !== false) {
          Notify.success("کد کلاس با موفقیت حذف شد");
          setUpdateSessions((prev) => prev.filter((s) => s._id !== session._id));
        } else {
          throw new Error(res?.message || "خطا در حذف کد کلاس");
        }
      } catch (err) {
        Notify.error(err.message || "خطا در حذف کد کلاس");
      }
    }
  };

  const handleSaveUpdateSession = async (session) => {
    const key = session._id || session.tempId;

    if (!session.code || !session.code.trim()) {
      Notify.error("وارد کردن عنوان کد کلاس الزامی است");
      return;
    }
    if (!session.scheduleDays || !session.scheduleDays.trim()) {
      Notify.error(`وارد کردن روزهای برگزاری برای «${session.code}» الزامی است`);
      return;
    }
    if (!session.scheduleHours || !session.scheduleHours.trim()) {
      Notify.error(`وارد کردن ساعت برگزاری برای «${session.code}» الزامی است`);
      return;
    }
    const cap = Number(session.capacity);
    if (!session.capacity || isNaN(cap) || cap < 1) {
      Notify.error(`ظرفیت برای «${session.code}» الزامی است و باید حداقل ۱ نفر باشد`);
      return;
    }

    setSavingSessionKey(key);
    try {
      const payload = {
        code: session.code.trim(),
        scheduleDays: session.scheduleDays.trim(),
        scheduleHours: session.scheduleHours.trim(),
        capacity: cap,
      };

      if (session.isNew) {
        const res = await axiosInstance.post(`in-person-courses/${courseId}/sessions`, payload);
        if (res && res.success !== false) {
          Notify.success("کد کلاس با موفقیت افزوده شد");
          const created = res.data;
          setUpdateSessions((prev) =>
            prev.map((s) => (s.tempId === session.tempId ? { ...created, isNew: false } : s))
          );
        } else {
          throw new Error(res?.message || "خطا در افزودن کد کلاس");
        }
      } else {
        const res = await axiosInstance.patch(`in-person-courses/${courseId}/sessions/${session._id}`, payload);
        if (res && res.success !== false) {
          Notify.success("کد کلاس با موفقیت بروزرسانی شد");
          const updated = res.data;
          setUpdateSessions((prev) =>
            prev.map((s) => (s._id === session._id ? { ...updated, isNew: false } : s))
          );
        } else {
          throw new Error(res?.message || "خطا در بروزرسانی کد کلاس");
        }
      }
    } catch (err) {
      Notify.error(err.message || "خطا در ذخیره اطلاعات کد کلاس");
    } finally {
      setSavingSessionKey(null);
    }
  };

  return (
    <div className="bg-bg-light/40 rounded-2xl border border-border/80 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h3 className="font-bold text-secondary text-base">کدهای کلاس</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            تعریف کدهای کلاس به همراه روزها، ساعت و ظرفیت مستقل (حداقل یک کد کلاس الزامی است)
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<AddIcon fontSize="small" />}
          onClick={handleAddSession}
        >
          افزودن کد کلاس جدید
        </Button>
      </div>

      {/* Sessions list */}
      {loadingSessions ? (
        <div className="py-8 flex justify-center"><Loading size={6} /></div>
      ) : activeSessions.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-muted bg-surface rounded-xl border border-dashed border-border">
          هیچ کد کلاسی تعریف نشده است. جهت ثبت دوره حضوری، حداقل یک کد کلاس باید ایجاد شود.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeSessions.map((session, index) => {
            const key = session._id || session.tempId || index;
            const fieldErrors = Array.isArray(errors.sessions) && errors.sessions[index] ? errors.sessions[index] : {};

            return (
              <CourseSessionRow
                key={key}
                session={session}
                index={index}
                mode={mode}
                canDelete={activeSessions.length > 1}
                onFieldChange={(sessionKey, field, val) =>
                  handleFieldChange(mode === "create" ? index : sessionKey, field, val)
                }
                onDelete={handleDeleteSession}
                onSave={handleSaveUpdateSession}
                isSaving={savingSessionKey === key}
                fieldErrors={fieldErrors}
              />
            );
          })}
        </div>
      )}

      {/* Global sessions validation error */}
      {typeof errors.sessions === "string" && touched.sessions && (
        <span className="text-xs text-error font-medium">{errors.sessions}</span>
      )}
    </div>
  );
}

import React from "react";
import { useFormikContext } from "formik";
import CourseSessionsManager from "../../../../Components/CourseSessionsManager";

export default function InPersonSessionsSection({ mode = "create", courseId = null }) {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  return (
    <CourseSessionsManager
      mode={mode}
      courseId={courseId}
      sessions={values.sessions || []}
      onChange={(newSessions) => setFieldValue("sessions", newSessions)}
      errors={errors}
      touched={touched}
    />
  );
}

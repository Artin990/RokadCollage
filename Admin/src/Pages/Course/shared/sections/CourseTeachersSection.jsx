import React from "react";
import { useFormikContext } from "formik";
import TeacherSelect from "../../../../Components/TeacherSelect";

export default function CourseTeachersSection() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  return (
    <div className="border-t border-border/80 pt-5">
      <TeacherSelect
        value={values.teachers}
        onChange={(ids) => setFieldValue("teachers", ids)}
        error={touched.teachers && errors.teachers}
      />
    </div>
  );
}

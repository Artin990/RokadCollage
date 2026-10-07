import React from "react";
import { useFormikContext } from "formik";
import { SvgIconInput } from "../../../../Components/UI";

export default function CourseIconSection() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  return (
    <div className="border-t border-border/80 pt-5">
      <SvgIconInput
        value={values.icon}
        onChange={(val) => setFieldValue("icon", val)}
        error={touched.icon && errors.icon}
      />
    </div>
  );
}

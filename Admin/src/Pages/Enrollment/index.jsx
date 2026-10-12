import React from "react";
import { Outlet } from "react-router-dom";
import EnrollmentPage from "./EnrollmentPage/index.jsx";

export default function Enrollment() {
  return <Outlet />;
}

export { EnrollmentPage };

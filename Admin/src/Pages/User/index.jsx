import React from "react";
import { Outlet } from "react-router-dom";
import UserPage from "./UserPage/index.jsx";
import UserFormModal from "./components/UserFormModal";
import UserTable from "./components/UserTable";

export default function User() {
  return <Outlet />;
}

export { UserPage, UserFormModal, UserTable };

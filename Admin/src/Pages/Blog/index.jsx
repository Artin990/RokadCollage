import React from "react";
import { Outlet } from "react-router-dom";
import BlogPage from "./BlogPage/index.jsx";
import CreateBlog from "./CreateBlog/index.jsx";
import UpdateBlog from "./UpdateBlog/index.jsx";
import SingleBlog from "./SingleBlog/index.jsx";

export default function Blog() {
  return <Outlet />;
}

export { BlogPage, CreateBlog, UpdateBlog, SingleBlog };

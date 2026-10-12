import React from "react";
import { Outlet } from "react-router-dom";
import CommentPage from "./CommentPage/index.jsx";
import CreateComment from "./CreateComment/index.jsx";
import UpdateComment from "./UpdateComment/index.jsx";
import SingleComment from "./SingleComment/index.jsx";

export default function Comment() {
  return <Outlet />;
}

export { CommentPage, CreateComment, UpdateComment, SingleComment };

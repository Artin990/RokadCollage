import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Layout & Core Pages
import Layout from "../Layout";
import Auth from "../Pages/Auth";
import Home from "../Pages/Home";
import NotFound from "../Pages/NotFound";

// In-Person Course Module
import InPersonCourseLayout, {
  InPersonCourseListPage,
  CreateInPersonCourse,
  UpdateInPersonCourse,
  SingleInPersonCourse,
} from "../Pages/Course/InPerson";

// Virtual Course Module
import VirtualCourseLayout, {
  VirtualCourseListPage,
  CreateVirtualCourse,
  UpdateVirtualCourse,
  SingleVirtualCourse,
} from "../Pages/Course/Virtual";

// Comment Module
import Comment from "../Pages/Comment";
import CommentPage from "../Pages/Comment/CommentPage";
import CreateComment from "../Pages/Comment/CreateComment";
import UpdateComment from "../Pages/Comment/UpdateComment";

// Blog Module
import Blog from "../Pages/Blog";
import BlogPage from "../Pages/Blog/BlogPage";
import CreateBlog from "../Pages/Blog/CreateBlog";
import UpdateBlog from "../Pages/Blog/UpdateBlog";

// Teacher Module
import Teacher from "../Pages/Teacher";
import TeacherPage from "../Pages/Teacher/TeacherPage";
import CreateTeacher from "../Pages/Teacher/CreateTeacher";
import UpdateTeacher from "../Pages/Teacher/UpdateTeacher";

// User Module
import User from "../Pages/User";
import UserPage from "../Pages/User/UserPage";

// Enrollment Module
import Enrollment from "../Pages/Enrollment";
import EnrollmentPage from "../Pages/Enrollment/EnrollmentPage";

// Seo Module
import SeoSettings from "../Pages/SeoSettings";

// Wallet Module
import WalletPage from "../Pages/Wallet";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // In-Person Courses
      {
        path: "in-person-courses",
        element: <InPersonCourseLayout />,
        children: [
          { index: true, element: <InPersonCourseListPage /> },
          { path: "create", element: <CreateInPersonCourse /> },
          { path: "update/:id", element: <UpdateInPersonCourse /> },
          { path: ":id", element: <SingleInPersonCourse /> },
        ],
      },
      // Virtual Courses
      {
        path: "virtual-courses",
        element: <VirtualCourseLayout />,
        children: [
          { index: true, element: <VirtualCourseListPage /> },
          { path: "create", element: <CreateVirtualCourse /> },
          { path: "update/:id", element: <UpdateVirtualCourse /> },
          { path: ":id", element: <SingleVirtualCourse /> },
        ],
      },
      // Redirect legacy /course path to /in-person-courses
      {
        path: "course",
        element: <Navigate to="/in-person-courses" replace />,
      },
      {
        path: "comment",
        element: <Comment />,
        children: [
          { index: true, element: <CommentPage /> },
          { path: "create", element: <CreateComment /> },
          { path: "update/:id", element: <UpdateComment /> },
        ],
      },
      {
        path: "blog",
        element: <Blog />,
        children: [
          { index: true, element: <BlogPage /> },
          { path: "create", element: <CreateBlog /> },
          { path: "update/:id", element: <UpdateBlog /> },
        ],
      },
      {
        path: "teacher",
        element: <Teacher />,
        children: [
          { index: true, element: <TeacherPage /> },
          { path: "create", element: <CreateTeacher /> },
          { path: "update/:id", element: <UpdateTeacher /> },
        ],
      },
      {
        path: "user",
        element: <User />,
        children: [
          { index: true, element: <UserPage /> },
        ],
      },
      {
        path: "seo",
        element: <SeoSettings />,
      },
      {
        path: "enrollment",
        element: <Enrollment />,
        children: [{ index: true, element: <EnrollmentPage /> }],
      },
      {
        path: "wallet",
        element: <WalletPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

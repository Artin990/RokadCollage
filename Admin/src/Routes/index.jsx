import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout";
import { PageSkeleton } from "../Components/UI";

// Dedicated standalone skeleton for auth login page
const AuthFallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafd] p-4 select-none" dir="rtl">
    <div className="w-full max-w-[430px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/50 p-7 sm:p-9 animate-pulse space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-200" />
        <div className="h-6 w-36 bg-slate-200 rounded-lg" />
        <div className="h-4 w-56 bg-slate-100 rounded-md" />
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
);

// Helper for lazy loading named exports
const lazyNamed = (importFn, exportName) =>
  lazy(() => importFn().then((module) => ({ default: module[exportName] })));

// Helper to wrap lazy components in Suspense with seamless, unified PageSkeleton
const withSuspense = (LazyComponent, FallbackComponent = PageSkeleton) => (
  <Suspense fallback={<FallbackComponent />}>
    <LazyComponent />
  </Suspense>
);

// Core Lazy Pages
const Auth = lazy(() => import("../Pages/Auth"));
const Home = lazy(() => import("../Pages/Home"));
const NotFound = lazy(() => import("../Pages/NotFound"));

// In-Person Course Module
const InPersonCourseLayout = lazy(() => import("../Pages/Course/InPerson"));
const InPersonCourseListPage = lazyNamed(() => import("../Pages/Course/InPerson"), "InPersonCourseListPage");
const CreateInPersonCourse = lazyNamed(() => import("../Pages/Course/InPerson"), "CreateInPersonCourse");
const UpdateInPersonCourse = lazyNamed(() => import("../Pages/Course/InPerson"), "UpdateInPersonCourse");
const SingleInPersonCourse = lazyNamed(() => import("../Pages/Course/InPerson"), "SingleInPersonCourse");

// Virtual Course Module
const VirtualCourseLayout = lazy(() => import("../Pages/Course/Virtual"));
const VirtualCourseListPage = lazyNamed(() => import("../Pages/Course/Virtual"), "VirtualCourseListPage");
const CreateVirtualCourse = lazyNamed(() => import("../Pages/Course/Virtual"), "CreateVirtualCourse");
const UpdateVirtualCourse = lazyNamed(() => import("../Pages/Course/Virtual"), "UpdateVirtualCourse");
const SingleVirtualCourse = lazyNamed(() => import("../Pages/Course/Virtual"), "SingleVirtualCourse");

// Dedicated Course Comments Module (Q&A & Reviews)
const CourseCommentsPage = lazy(() => import("../Pages/CourseComment"));

// Comment Module
const Comment = lazy(() => import("../Pages/Comment"));
const CommentPage = lazyNamed(() => import("../Pages/Comment"), "CommentPage");
const CreateComment = lazyNamed(() => import("../Pages/Comment"), "CreateComment");
const UpdateComment = lazyNamed(() => import("../Pages/Comment"), "UpdateComment");
const SingleComment = lazyNamed(() => import("../Pages/Comment"), "SingleComment");

// Blog Module
const Blog = lazy(() => import("../Pages/Blog"));
const BlogPage = lazyNamed(() => import("../Pages/Blog"), "BlogPage");
const CreateBlog = lazyNamed(() => import("../Pages/Blog"), "CreateBlog");
const UpdateBlog = lazyNamed(() => import("../Pages/Blog"), "UpdateBlog");
const SingleBlog = lazyNamed(() => import("../Pages/Blog"), "SingleBlog");

// Teacher Module
const Teacher = lazy(() => import("../Pages/Teacher"));
const TeacherPage = lazyNamed(() => import("../Pages/Teacher"), "TeacherPage");
const CreateTeacher = lazyNamed(() => import("../Pages/Teacher"), "CreateTeacher");
const UpdateTeacher = lazyNamed(() => import("../Pages/Teacher"), "UpdateTeacher");

// User Module
const User = lazy(() => import("../Pages/User"));
const UserPage = lazyNamed(() => import("../Pages/User"), "UserPage");

// Enrollment Module
const Enrollment = lazy(() => import("../Pages/Enrollment"));
const EnrollmentPage = lazyNamed(() => import("../Pages/Enrollment"), "EnrollmentPage");

// Seo Module
const SeoSettings = lazy(() => import("../Pages/SeoSettings"));

// Wallet Module
const WalletPage = lazy(() => import("../Pages/Wallet"));

const router = createBrowserRouter([
  {
    path: "/auth",
    element: withSuspense(Auth, AuthFallback),
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      // In-Person Courses
      {
        path: "in-person-courses",
        element: withSuspense(InPersonCourseLayout),
        children: [
          { index: true, element: withSuspense(InPersonCourseListPage) },
          { path: "create", element: withSuspense(CreateInPersonCourse) },
          { path: "update/:id", element: withSuspense(UpdateInPersonCourse) },
          { path: ":id", element: withSuspense(SingleInPersonCourse) },
        ],
      },
      // Virtual Courses
      {
        path: "virtual-courses",
        element: withSuspense(VirtualCourseLayout),
        children: [
          { index: true, element: withSuspense(VirtualCourseListPage) },
          { path: "create", element: withSuspense(CreateVirtualCourse) },
          { path: "update/:id", element: withSuspense(UpdateVirtualCourse) },
          { path: ":courseId/comments", element: withSuspense(CourseCommentsPage) },
          { path: "comments", element: withSuspense(CourseCommentsPage) },
          { path: ":id", element: withSuspense(SingleVirtualCourse) },
        ],
      },
      // Standalone direct route for course comments
      {
        path: "course-comments/:courseId?",
        element: withSuspense(CourseCommentsPage),
      },
      // Redirect legacy /course path to /in-person-courses
      {
        path: "course",
        element: <Navigate to="/in-person-courses" replace />,
      },
      {
        path: "comment",
        element: withSuspense(Comment),
        children: [
          { index: true, element: withSuspense(CommentPage) },
          { path: "create", element: withSuspense(CreateComment) },
          { path: "update/:id", element: withSuspense(UpdateComment) },
          { path: ":id", element: withSuspense(SingleComment) },
        ],
      },
      {
        path: "blog",
        element: withSuspense(Blog),
        children: [
          { index: true, element: withSuspense(BlogPage) },
          { path: "create", element: withSuspense(CreateBlog) },
          { path: "update/:id", element: withSuspense(UpdateBlog) },
          { path: ":id", element: withSuspense(SingleBlog) },
        ],
      },
      {
        path: "teacher",
        element: withSuspense(Teacher),
        children: [
          { index: true, element: withSuspense(TeacherPage) },
          { path: "create", element: withSuspense(CreateTeacher) },
          { path: "update/:id", element: withSuspense(UpdateTeacher) },
        ],
      },
      {
        path: "user",
        element: withSuspense(User),
        children: [
          { index: true, element: withSuspense(UserPage) },
        ],
      },
      {
        path: "seo",
        element: withSuspense(SeoSettings),
      },
      {
        path: "enrollment",
        element: withSuspense(Enrollment),
        children: [{ index: true, element: withSuspense(EnrollmentPage) }],
      },
      {
        path: "wallet",
        element: withSuspense(WalletPage),
      },
      // Authenticated Dashboard Catch-all (Preserves sidebar & navigation)
      {
        path: "*",
        element: withSuspense(NotFound),
      },
    ],
  },
  // Unauthenticated / Top-level Catch-all (Standalone)
  {
    path: "*",
    element: withSuspense(NotFound),
  },
]);

export default router;

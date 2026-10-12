import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Routes";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./Components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          style: {
            direction: "rtl",
            fontFamily: "var(--font-sans, 'Vazirmatn', sans-serif)",
          },
        }}
      />
    </ErrorBoundary>
  );
}

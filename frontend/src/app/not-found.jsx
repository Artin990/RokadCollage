"use client";

import Header from "@/components/Header/index.jsx";
import Footer from "@/components/Footer/index.jsx";
import NotFoundContent from "@/components/NotFoundContent.jsx";

export default function RootNotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}

"use client";

import Header from "@/components/Header/index.jsx";
import Footer from "@/components/Footer/index.jsx";
import ConsultationModal from "@/components/ConsultationModal/index.jsx";
import AuthPromptToast from "@/components/AuthPromptToast/index.jsx";
import { useState, useEffect } from "react";

export default function MainLayout({ children }) {
  const [consultOpen, setConsultOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      setConsultOpen(window.location.hash === "#consult");
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const closeConsult = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "";
    }
  };

  return (
    <>
      <ConsultationModal isOpen={consultOpen} onClose={closeConsult} />
      <AuthPromptToast />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

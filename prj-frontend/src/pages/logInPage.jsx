import React from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { Navbar } from "../components/common/Navbar";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="w-full max-w-[480px]">
          <LoginForm />
        </div>
      </main>

      {/* Subtle footer credit */}
      <footer className="p-8 text-center relative z-10">
        <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          The Academic Hood &copy; 2026 &bull; Elevating Learning
        </p>
      </footer>
    </div>
  );
};


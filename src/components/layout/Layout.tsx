import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AITutorChat } from "../ai/AITutorChat";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

export function Layout() {
  const [isPractice, setIsPractice] = useState(false);

  useEffect(() => {
    const handlePracticeState = (e: any) => {
      setIsPractice(e.detail.isPractice);
    };
    window.addEventListener('practice-state', handlePracticeState);
    return () => window.removeEventListener('practice-state', handlePracticeState);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {!isPractice && <Sidebar />}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!isPractice && <Header />}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className={`flex-1 ${isPractice ? 'p-2 md:p-8 bg-slate-50 dark:bg-slate-950' : 'p-6'}`}>
            <Outlet />
          </div>
          <footer className="w-full text-center py-4 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
            © {new Date().getFullYear()} CHEMAI LMS. Đồng tác giả: Thầy giáo Bùi Hữu Hải và thầy giáo Lương Hải Anh - Trường THPT Chuyên Nguyễn Trãi.
          </footer>
        </main>
      </div>
      <AITutorChat />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

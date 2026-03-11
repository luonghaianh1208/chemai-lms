import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AITutorChat } from "../ai/AITutorChat";
import { Toaster } from "sonner";
import { useState, useEffect, useCallback } from "react";

const COLLAPSE_KEY = "sidebar_collapsed";

export function Layout() {
  const [isPractice, setIsPractice] = useState(false);

  // Mobile: sidebar open/closed (always starts closed on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop/tablet: sidebar collapsed to icon-only
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Persist preference in localStorage
    try { return localStorage.getItem(COLLAPSE_KEY) === "true"; } catch { return false; }
  });

  useEffect(() => {
    const handlePracticeState = (e: any) => {
      setIsPractice(e.detail.isPractice);
    };
    window.addEventListener('practice-state', handlePracticeState);
    return () => window.removeEventListener('practice-state', handlePracticeState);
  }, []);

  // Auto-collapse sidebar on small screens when component mounts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(COLLAPSE_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const handleOpenSidebar = useCallback(() => setSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {!isPractice && (
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={handleCloseSidebar}
          onToggleCollapse={handleToggleCollapse}
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {!isPractice && (
          <Header
            onOpenSidebar={handleOpenSidebar}
          />
        )}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className={`flex-1 ${isPractice ? 'p-2 md:p-8 bg-slate-50 dark:bg-slate-950' : 'p-4 md:p-6'}`}>
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

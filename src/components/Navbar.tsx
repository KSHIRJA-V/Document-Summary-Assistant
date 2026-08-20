"use client";

import React from "react";
import { Sparkles, FileText, Settings, Moon, Sun, BookOpen, ExternalLink, RefreshCw } from "lucide-react";
import { UserAppSettings } from "@/types";

interface NavbarProps {
  settings: UserAppSettings;
  onUpdateSettings: (newSettings: Partial<UserAppSettings>) => void;
  onOpenDocs: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
  hasDocument: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  onOpenDocs,
  onOpenSettings,
  onReset,
  hasDocument,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === "dark" ? "light" : "dark";
    onUpdateSettings({ theme: nextTheme });
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#0b0f17]/90 border-b border-slate-200 dark:border-unthinkable-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-9 h-9 rounded-lg bg-[#11161f] border border-[#243242] flex items-center justify-center shadow-emerald-sm">
            <span className="text-[#5dd667] font-black text-xl tracking-tighter">U</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                unthinkable<span className="text-[#5dd667]">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#5dd667]/15 text-[#5dd667] border border-[#5dd667]/30">
                Doc AI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-unthinkable-textMuted -mt-1 font-medium hidden sm:inline">
              Document Summary Assistant
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasDocument && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-unthinkable-cardHover border border-slate-300 dark:border-unthinkable-border transition-all"
              title="Upload another document"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#5dd667]" />
              <span className="hidden sm:inline">New Document</span>
            </button>
          )}

          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-unthinkable-cardHover border border-slate-300 dark:border-unthinkable-border transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5dd667]" />
            <span className="hidden sm:inline">Assessment Write-up</span>
            <span className="sm:hidden">Write-up</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-unthinkable-cardHover border border-slate-300 dark:border-unthinkable-border transition-all"
            title="Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-unthinkable-cardHover border border-slate-300 dark:border-unthinkable-border transition-all"
            title={settings.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {settings.theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <a
            href="https://www.unthinkable.co/career/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#5dd667] text-[#0b0f17] hover:bg-[#4ec257] shadow-emerald-sm transition-all hover:scale-[1.02]"
          >
            <span>Unthinkable Careers</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};

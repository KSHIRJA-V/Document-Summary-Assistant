"use client";

import React from "react";
import { FileText, Moon, Sun, RefreshCw } from "lucide-react";
import { UserAppSettings } from "@/types";

interface NavbarProps {
  settings: UserAppSettings;
  onUpdateSettings: (newSettings: Partial<UserAppSettings>) => void;
  onReset: () => void;
  hasDocument: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
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
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
              Document Summary Assistant
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {hasDocument && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Document</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all"
            title={settings.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {settings.theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

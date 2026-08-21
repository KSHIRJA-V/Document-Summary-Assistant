"use client";

import React, { useState } from "react";
import { FileText, Moon, Sun, RefreshCw, History, FileType, Image as ImageIcon, ChevronDown, Trash2 } from "lucide-react";
import { SessionDocumentItem, UserAppSettings } from "@/types";

interface NavbarProps {
  settings: UserAppSettings;
  onUpdateSettings: (newSettings: Partial<UserAppSettings>) => void;
  onReset: () => void;
  hasDocument: boolean;
  sessionHistory?: SessionDocumentItem[];
  currentDocId?: string;
  onSelectSessionDoc?: (item: SessionDocumentItem) => void;
  onClearSessionHistory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  onReset,
  hasDocument,
  sessionHistory = [],
  currentDocId,
  onSelectSessionDoc,
  onClearSessionHistory,
}) => {
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

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
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
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
          
          {/* Session History Dropdown */}
          {sessionHistory.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all"
                title="View documents processed in this session"
              >
                <History className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Session History</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  {sessionHistory.length}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showHistoryDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Session Documents ({sessionHistory.length})</span>
                    {onClearSessionHistory && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearSessionHistory();
                          setShowHistoryDropdown(false);
                        }}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold text-[10px] normal-case"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto mt-1 space-y-1">
                    {sessionHistory.map((item) => {
                      const isCurrent = item.id === currentDocId;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectSessionDoc?.(item);
                            setShowHistoryDropdown(false);
                          }}
                          className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors ${
                            isCurrent
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-semibold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            {item.type === "pdf" ? (
                              <FileType className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {item.timestamp}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

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

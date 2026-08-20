"use client";

import React, { useState } from "react";
import { X, Settings, Key, Cpu, Shield, Check, Sparkles } from "lucide-react";
import { UserAppSettings } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserAppSettings;
  onSaveSettings: (newSettings: Partial<UserAppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey || "");
  const [aiProvider, setAiProvider] = useState(settings.aiProvider);
  const [highlightKeywords, setHighlightKeywords] = useState(settings.highlightKeywords);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      apiKey: apiKey.trim() || undefined,
      aiProvider,
      highlightKeywords,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-unthinkable-card transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-unthinkable-border">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-center justify-center text-slate-800 dark:text-white">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Assistant Preferences & Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-unthinkable-textMuted">
              Configure intelligence pipeline and API keys.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Intelligence Engine */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#5dd667]" />
              <span>Intelligence Pipeline Mode</span>
            </label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5dd667]"
            >
              <option value="built-in">Built-in Local Extractor & NLP (No API Key Required, 100% Offline)</option>
              <option value="gemini">Google Gemini 1.5 Flash (Requires API Key)</option>
              <option value="openai">OpenAI / Compatible Provider</option>
            </select>
          </div>

          {/* Optional API Key */}
          {aiProvider !== "built-in" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>API Key (Stored locally in session)</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter AI API Key..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5dd667] font-mono"
              />
            </div>
          )}

          {/* Toggles */}
          <div className="pt-3 border-t border-slate-100 dark:border-unthinkable-border space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Highlight key metrics & entities in summary
              </span>
              <input
                type="checkbox"
                checked={highlightKeywords}
                onChange={(e) => setHighlightKeywords(e.target.checked)}
                className="w-4 h-4 rounded text-[#5dd667] focus:ring-[#5dd667] accent-[#5dd667]"
              />
            </label>
          </div>

          <div className="p-3 rounded-xl bg-[#5dd667]/10 dark:bg-[#5dd667]/5 border border-[#5dd667]/20 text-[11px] text-slate-600 dark:text-unthinkable-textMuted flex items-start space-x-2">
            <Shield className="w-4 h-4 text-[#5dd667] flex-shrink-0 mt-0.5" />
            <span>The built-in engine processes documents 100% locally in your browser. No document data is sent to external servers unless an external API key is provided.</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-unthinkable-border flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-unthinkable-card transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#5dd667] text-[#0b0f17] font-bold text-xs hover:bg-[#4ec257] shadow-emerald-sm transition-all flex items-center gap-1.5"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Saved!" : "Save Preferences"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { X, Sparkles, Key, Check, ExternalLink, Cpu } from "lucide-react";
import { AIModelProvider, UserAppSettings } from "@/types";

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserAppSettings;
  onUpdateSettings: (newSettings: Partial<UserAppSettings>) => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [provider, setProvider] = useState<AIModelProvider>(settings.modelProvider || "gemini");
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || "");
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey || "");
  const [groqKey, setGroqKey] = useState(settings.groqApiKey || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: Partial<UserAppSettings> = {
      modelProvider: provider,
      geminiApiKey: geminiKey.trim(),
      openaiApiKey: openaiKey.trim(),
      groqApiKey: groqKey.trim(),
    };

    onUpdateSettings(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("doc_assistant_ai_settings", JSON.stringify(updated));
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Summary Model Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the model used to generate intelligent abstractive summaries.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Model Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <div
                onClick={() => setProvider("gemini")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  provider === "gemini"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Google Gemini</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold">
                    Free / Fast
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Gemini 1.5 Flash. Human-grade abstractive summaries.
                </p>
              </div>

              <div
                onClick={() => setProvider("groq")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  provider === "groq"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Groq (Llama 3.3)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-semibold">
                    Free Tier
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ultra high-speed open LLM inference.
                </p>
              </div>

              <div
                onClick={() => setProvider("openai")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  provider === "openai"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">OpenAI</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 font-semibold">
                    GPT-4o Mini
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Standard OpenAI GPT model API.
                </p>
              </div>

              <div
                onClick={() => setProvider("local")}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  provider === "local"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Local NLP Engine</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 font-semibold">
                    Offline
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sanitized heuristic summarizer (No API key needed).
                </p>
              </div>

            </div>
          </div>

          {/* API Key Input */}
          {provider === "gemini" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Gemini API Key</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-600 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400">
                Key is stored only in your local browser storage.
              </p>
            </div>
          )}

          {provider === "groq" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-500" />
                  <span>Groq API Key</span>
                </label>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Free Groq Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {provider === "openai" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-500" />
                <span>OpenAI API Key</span>
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{saved ? "Saved!" : "Save & Apply"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

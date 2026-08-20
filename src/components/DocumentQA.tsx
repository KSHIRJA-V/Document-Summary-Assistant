"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, Bot, Copy, Check, CornerDownLeft, Loader2 } from "lucide-react";
import { ChatMessage, UserAppSettings } from "@/types";
import { copyToClipboard } from "@/lib/export-utils";

interface DocumentQAProps {
  documentText: string;
  documentTitle: string;
  settings: UserAppSettings;
}

export const DocumentQA: React.FC<DocumentQAProps> = ({
  documentText,
  documentTitle,
  settings,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello! I have analyzed **${documentTitle}**. You can ask me anything about the figures, obligations, architecture, deadlines, or risks contained in this document.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    "What are the main risks or SLAs mentioned?",
    "Summarize all key dates and deadlines",
    "What are the primary financial or performance figures?",
    "List the actionable deliverables and next steps",
  ];

  const handleSend = async (queryToSend?: string) => {
    const question = queryToSend || inputQuery;
    if (!question.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryToSend) setInputQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          text: documentText,
          question: question.trim(),
          apiKey: settings.apiKey,
          provider: settings.aiProvider,
        }),
      });

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Could not extract a definitive answer for this question from the document.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: `Error responding to question: ${err.message || "Failed to query document assistant."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl shadow-sm flex flex-col h-[650px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-unthinkable-border flex items-center justify-between bg-slate-50/50 dark:bg-unthinkable-card/40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#5dd667]/20 border border-[#5dd667]/30 flex items-center justify-center text-[#2d7534] dark:text-[#5dd667]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Document Conversational Assistant
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-unthinkable-textMuted">
              Grounding context: {documentTitle}
            </span>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#5dd667]/15 text-[#2d7534] dark:text-[#5dd667] border border-[#5dd667]/30">
          Interactive Grounding
        </span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                msg.role === "user"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                  : "bg-[#5dd667]/20 border border-[#5dd667]/30 text-[#2d7534] dark:text-[#5dd667]"
              }`}
            >
              {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                msg.role === "user"
                  ? "bg-slate-900 dark:bg-[#1f2937] text-white"
                  : "bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-slate-800 dark:text-slate-200"
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>

              <div
                className={`mt-2 flex items-center justify-between text-[10px] ${
                  msg.role === "user" ? "text-slate-400" : "text-slate-400 dark:text-unthinkable-textDim"
                }`}
              >
                <span>{msg.timestamp}</span>

                <button
                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:text-white"
                  title="Copy answer"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-[#5dd667]/20 border border-[#5dd667]/30 flex items-center justify-center text-[#5dd667]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-xs text-slate-500 dark:text-unthinkable-textMuted flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 text-[#5dd667] animate-spin" />
              <span>Analyzing document context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2 bg-slate-50/70 dark:bg-unthinkable-card/30 border-t border-slate-100 dark:border-unthinkable-border flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 dark:text-unthinkable-textDim whitespace-nowrap">
          Suggestions:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border hover:border-[#5dd667]/60 text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-white dark:bg-unthinkable-panel border-t border-slate-200 dark:border-unthinkable-border flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about this document (e.g. 'What is the liability cap?')..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5dd667]"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-[#5dd667] text-[#0b0f17] font-bold text-xs sm:text-sm hover:bg-[#4ec257] shadow-emerald-sm transition-all disabled:opacity-50 flex items-center space-x-1.5"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};

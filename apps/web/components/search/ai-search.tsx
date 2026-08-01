'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, FileText, ExternalLink, Search, Loader2 } from 'lucide-react';

interface AiSearchProps {
  workspaceSlug: string;
}

export function AiSearch({ workspaceSlug }: AiSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{ answer: string; sources: { title: string; url: string }[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);

    // Simulate API call and AI thinking time
    setTimeout(() => {
      setResult({
        answer: `بناءً على بحثي في مساحة العمل الخاصة بك، هذه هي الإجابة عن: "${query}". لقد وجدت بعض المعلومات ذات الصلة في صفحاتك المختلفة. يبدو أن هناك مهام مفتوحة مرتبطة بمشروع التحديث الأخير، وكذلك بعض الملاحظات المهمة من الاجتماع السابق.`,
        sources: [
          { title: 'ملاحظات اجتماع الفريق', url: `/${workspaceSlug}/meeting-notes` },
          { title: 'خطة إطلاق المشروع', url: `/${workspaceSlug}/project-plan` },
        ]
      });
      setIsSearching(false);
    }, 2500);
  };

  const suggestions = [
    "ما هي المهام المفتوحة؟",
    "لخّص ملاحظات الاجتماع الأخير",
    "من المسؤول عن مشروع مسار؟"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4 font-cairo">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-800/30">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-slate-200">البحث الذكي (AI Search)</h2>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="relative border-b border-slate-800">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اسأل مسار عن أي شيء في مساحة عملك..."
            className="w-full bg-transparent border-none py-4 pr-12 pl-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0 text-lg"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bot className="w-5 h-5" />
          </button>
        </form>

        {/* Content Area */}
        <div className="p-6 bg-slate-900/50 min-h-[300px]">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin relative z-10" />
              </div>
              <p className="text-slate-400 animate-pulse text-sm font-medium">جاري البحث وتحليل صفحات مساحة العمل...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Bot className="w-6 h-6 text-emerald-400 mt-1 shrink-0" />
                  <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                    {result.answer}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  المصادر المرجعية
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      <span>من صفحة: {source.title}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">اقتراحات للبحث</h4>
              <div className="grid gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(suggestion);
                    }}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/30 hover:border-emerald-500/30 rounded-xl text-slate-300 transition-all text-right group"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

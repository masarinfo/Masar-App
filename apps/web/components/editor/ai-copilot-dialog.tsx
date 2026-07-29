'use client';

import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowLeft, RefreshCw, Languages, FileText } from 'lucide-react';

interface AiCopilotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onInsert: (text: string) => void;
  onReplace: (text: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function AiCopilotDialog({
  isOpen,
  onClose,
  selectedText,
  onInsert,
  onReplace,
}: AiCopilotDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (type: string = 'freeform', customPrompt: string = prompt) => {
    if (type === 'freeform' && !customPrompt.trim()) return;

    setIsLoading(true);
    setResult(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt: customPrompt,
          context: selectedText,
          type,
        }),
      });

      if (!res.ok) throw new Error('فشل التوليد');
      const data = await res.json();
      setResult(data.text);
    } catch (error) {
      setResult('حدث خطأ أثناء التوليد. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold font-cairo">المساعد الذكي (Ask AI)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Context Snippet */}
          {selectedText && !result && (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-slate-300 line-clamp-3">
              <span className="text-slate-500 text-xs block mb-1">النص المحدد:</span>
              "{selectedText}"
            </div>
          )}

          {/* Quick Actions (only show if no result yet and there is selected text) */}
          {selectedText && !result && !isLoading && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenerate('summarize')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                تلخيص النص
              </button>
              <button
                onClick={() => handleGenerate('rewrite')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                إعادة صياغة
              </button>
              <button
                onClick={() => handleGenerate('translate_en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
              >
                <Languages className="w-3.5 h-3.5 text-purple-400" />
                ترجمة للإنجليزية
              </button>
            </div>
          )}

          {/* Result Area */}
          {result && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-100 text-sm leading-relaxed max-h-60 overflow-y-auto font-cairo">
              {result}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-sm text-slate-400 animate-pulse">جاري التفكير والتوليد الذكي...</p>
            </div>
          )}

          {/* Input Area */}
          {!isLoading && (
            <div className="relative mt-2">
              <input
                type="text"
                autoFocus
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={result ? "اطلب تعديلاً إضافياً..." : "اطلب من الذكاء الاصطناعي كتابة أي شيء..."}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={!prompt.trim()}
                className="absolute left-2 top-2 p-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Footer (Only when result is ready) */}
        {result && !isLoading && (
          <div className="flex items-center justify-end gap-2 p-3 border-t border-slate-800 bg-slate-900/50">
            <button
              onClick={() => {
                setResult(null);
                setPrompt('');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              إلغاء وإعادة المحاولة
            </button>
            <button
              onClick={() => {
                onInsert(result);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              إدراج أدناه
            </button>
            {selectedText && (
              <button
                onClick={() => {
                  onReplace(result);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                استبدال التحديد
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

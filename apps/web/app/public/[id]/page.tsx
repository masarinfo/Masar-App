'use client';

import React, { useEffect, useState, use } from 'react';
import { ArabicBlockEditor } from '@/components/editor/arabic-block-editor';
import { Card } from '@/components/ui/card';
import { Sparkles, FileText, Lock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function PublicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicPage = async () => {
      try {
        const res = await fetch(`${API_URL}/public/pages/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error('هذه الصفحة غير متاحة للعامة أو تم حذفها.');
        }
        const data = await res.json();
        setPageData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPage();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] to-[#0f172a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] to-[#0f172a] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Lock className="w-16 h-16 text-slate-700 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-300 font-cairo">الصفحة غير متاحة</h1>
          <p className="text-slate-500">{error || 'يبدو أن هذه الصفحة قد تم إخفاؤها أو أن الرابط غير صحيح.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 p-4 md:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6 z-10 relative">
        <header className="flex flex-col items-center text-center gap-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 text-slate-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نُشر عبر مسار (Masar SaaS)</span>
          </div>
          <h1 className="text-4xl font-black text-white font-cairo flex items-center gap-3">
            <span className="text-5xl">{pageData.icon || <FileText className="w-10 h-10 text-emerald-500" />}</span>
            {pageData.title || 'مستند بدون عنوان'}
          </h1>
        </header>

        <Card className="p-4 md:p-8 border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-sm min-h-[50vh]">
          {/* Read-only view of the editor */}
          <div className="pointer-events-none opacity-90">
             <ArabicBlockEditor
               onChange={() => {}}
             />
          </div>
          <p className="text-center text-slate-500 text-xs mt-10">هذه نسخة للقراءة فقط (Read-only View)</p>
        </Card>
      </div>
    </div>
  );
}

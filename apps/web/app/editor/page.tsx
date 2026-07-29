'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArabicBlockEditor } from '@/components/editor/arabic-block-editor';
import { CollaborationHeader } from '@/components/editor/collaboration-header';
import { useCollaboration } from '@/hooks/use-collaboration';
import { useAuthStore } from '@/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft, Save, Code, Users } from 'lucide-react';

export default function EditorPage() {
  const { user } = useAuthStore();
  const [documentId] = useState('demo-doc-001');
  const { isConnected, activeUsers } = useCollaboration(documentId, {
    id: user?.id || 'guest-1',
    name: user?.name || 'مستخدم مسار التشاركي',
  });

  const [editorJSON, setEditorJSON] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 right-20 w-[30rem] h-[30rem] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-[30rem] h-[30rem] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-6 z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 3 - Module 05: Realtime Collaboration & Yjs Sync</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white font-cairo">
              المحرر التفاعلي التشاركي اللحظي
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              تحرير تعاوني تشاركي متعدد المستخدمين بدون تعارض عبر WebSockets و CRDTs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'تم الحفظ!' : 'حفظ المستند'}</span>
            </Button>

            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Realtime Collaboration Bar */}
        <CollaborationHeader
          documentTitle="مستند التخطيط البرمجي لمسار SaaS"
          isConnected={isConnected}
          activeUsers={activeUsers}
          pageId={documentId}
          isPublished={isPublished}
          onTogglePublish={setIsPublished}
        />

        {/* Editor Main Canvas */}
        <div className="space-y-6">
          <ArabicBlockEditor onChange={(json) => setEditorJSON(json)} />
        </div>

        {/* JSON Snapshot Viewer */}
        {editorJSON && (
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>معاينة بنية الهيكل البرمجي (JSON Snapshot)</span>
                </CardTitle>
                <CardDescription>اللقطة البنائية الحالية لمحتوى المستند للتأطير مع Yjs والـ DB</CardDescription>
              </div>
              <Badge variant="cyan">Yjs Live Snapshot</Badge>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-emerald-400 font-mono overflow-x-auto max-h-60 dir-ltr text-left">
                {JSON.stringify(editorJSON, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { usePageStore } from '@/stores/use-page-store';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { SidebarPageTree } from '@/components/layout/sidebar-page-tree';
import { ArabicBlockEditor } from '@/components/editor/arabic-block-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Sparkles, FolderTree, FileText } from 'lucide-react';

export default function WorkspaceTreePage() {
  const { checkAuth } = useAuthStore();
  const { activeWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { activePage, fetchPageTree, updatePage } = usePageStore();

  useEffect(() => {
    checkAuth();
    fetchWorkspaces();
  }, [checkAuth, fetchWorkspaces]);

  useEffect(() => {
    if (activeWorkspace?.id) {
      fetchPageTree(activeWorkspace.id);
    }
  }, [activeWorkspace?.id, fetchPageTree]);

  const handleTitleChange = (newTitle: string) => {
    if (activePage) {
      updatePage(activePage.id, { title: newTitle });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900/90 border-b md:border-b-0 md:border-l border-slate-800 p-4 space-y-6 flex-shrink-0 backdrop-blur-xl">
        <WorkspaceSwitcher />
        {activeWorkspace && <SidebarPageTree workspaceId={activeWorkspace.id} />}
      </aside>

      {/* Main Document Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19]">
        {/* Glow */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="gap-1">
                <FolderTree className="w-3.5 h-3.5" />
                <span>شجرة المستندات المتداخلة</span>
              </Badge>
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>الرئيسية</span>
              </Button>
            </Link>
          </div>

          {/* Active Document Editor */}
          {activePage ? (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Document Title Header */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activePage.icon || '📄'}</span>
                <input
                  type="text"
                  value={activePage.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="عنوان المستند..."
                  className="w-full bg-transparent text-3xl font-black font-cairo text-white focus:outline-none border-b border-transparent focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* TipTap Arabic Block Editor */}
              <ArabicBlockEditor
                content={activePage.content}
                onChange={(content) => updatePage(activePage.id, { content })}
              />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-3 border border-slate-800/80 rounded-2xl bg-slate-900/40">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300 font-cairo">لا يوجد مستند محدد</h3>
              <p className="text-xs">حدد مستنداً من الشريط الجانبي أو أضف صفحة جديدة للبدء في الكتابة.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

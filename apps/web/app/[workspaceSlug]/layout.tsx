'use client';

import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { usePageStore } from '@/stores/use-page-store';
import { AppShell } from '@/components/layout/app-shell';
import { Loader2 } from 'lucide-react';
import { CommandPalette } from '@/components/search/command-palette';

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceSlug = decodeURIComponent(resolvedParams.workspaceSlug);
  const router = useRouter();
  
  const { isAuthenticated, checkAuth, isLoading: authLoading } = useAuthStore();
  const { activeWorkspace, selectWorkspaceBySlug, isLoading: workspaceLoading, error } = useWorkspaceStore();
  const { fetchPageTree } = usePageStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && workspaceSlug) {
      selectWorkspaceBySlug(workspaceSlug);
    }
  }, [isAuthenticated, workspaceSlug, selectWorkspaceBySlug]);

  useEffect(() => {
    if (activeWorkspace?.id) {
      fetchPageTree(activeWorkspace.id);
    }
  }, [activeWorkspace?.id, fetchPageTree]);

  if (authLoading || workspaceLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || (!workspaceLoading && !activeWorkspace)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-cairo text-rose-500">حدث خطأ</h2>
          <p className="text-slate-400">{error || 'لم يتم العثور على مساحة العمل'}</p>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm transition-colors">
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppShell workspaceSlug={workspaceSlug}>
        {children}
      </AppShell>
      <CommandPalette workspaceSlug={workspaceSlug} />
    </>
  );
}

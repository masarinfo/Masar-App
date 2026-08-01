'use client';

import React, { useEffect, useState } from 'react';
import { useLayoutStore } from '@/stores/use-layout-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { usePageStore } from '@/stores/use-page-store';
import { SidebarPageTree } from './sidebar-page-tree';
import { Search, Home, Settings, Trash, Plus, Menu, ChevronDown } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  workspaceSlug: string;
}

export function AppShell({ children, workspaceSlug }: AppShellProps) {
  const { sidebarOpen, sidebarWidth, toggleSidebar } = useLayoutStore();
  const { activeWorkspace, selectWorkspaceBySlug, fetchWorkspaces } = useWorkspaceStore();
  const { fetchPageTree, createPage } = usePageStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
    selectWorkspaceBySlug(workspaceSlug);
  }, [workspaceSlug, selectWorkspaceBySlug, fetchWorkspaces]);

  useEffect(() => {
    if (activeWorkspace) {
      fetchPageTree(activeWorkspace.id);
    }
  }, [activeWorkspace, fetchPageTree]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === '\\') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const handleCreateNewPage = async () => {
    if (!activeWorkspace) return;
    await createPage({
      title: 'صفحة جديدة',
      icon: '📄',
      workspaceId: activeWorkspace.id,
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-readex text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-100">
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: sidebarOpen ? sidebarWidth : 0 }}
        className={`fixed md:relative z-50 h-full flex-shrink-0 transition-all duration-300 ease-in-out glass-panel border-l border-white/5 flex flex-col ${
          sidebarOpen || isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:!w-0 overflow-hidden'
        } ${isMobileOpen ? 'w-[280px] right-0' : ''}`}
      >
        <div className="flex flex-col h-full w-full min-w-[240px]">
          {/* Workspace Switcher */}
          <div className="p-3">
            <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-cairo">
                  {activeWorkspace?.name?.charAt(0) || 'M'}
                </div>
                <span className="text-sm font-semibold font-cairo truncate">
                  {activeWorkspace?.name || 'جاري التحميل...'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-0 space-y-6 scrollbar-hide">
            
            {/* Navigation */}
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 transition-colors text-sm">
                <Search className="w-4 h-4" />
                <span>بحث</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 transition-colors text-sm">
                <Home className="w-4 h-4" />
                <span>الرئيسية (داشبورد)</span>
              </button>
            </div>

            {/* Favorites (Placeholder) */}
            <div className="space-y-1">
               <div className="px-2 text-xs font-bold text-slate-400 font-cairo">المفضلة</div>
               <div className="px-2 py-1 text-xs text-slate-500">لا توجد صفحات مفضلة</div>
            </div>

            {/* Page Tree */}
            {activeWorkspace && (
              <SidebarPageTree workspaceId={activeWorkspace.id} />
            )}
          </div>

          {/* Bottom Section */}
          <div className="p-3 border-t border-white/5 space-y-0.5 bg-slate-950/30">
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 transition-colors text-sm">
              <Settings className="w-4 h-4" />
              <span>الإعدادات</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 transition-colors text-sm">
              <Trash className="w-4 h-4" />
              <span>سلة المحذوفات</span>
            </button>
            <button 
              onClick={handleCreateNewPage}
              className="w-full mt-2 flex items-center justify-center gap-2 px-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors text-sm font-semibold font-cairo"
            >
              <Plus className="w-4 h-4" />
              <span>صفحة جديدة</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative z-0 bg-slate-950">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-3 border-b border-white/5 glass-panel sticky top-0 z-10">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-cairo font-semibold text-sm mr-2 truncate">
            {activeWorkspace?.name || 'مسار'}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { use, useEffect, useState } from 'react';
import { usePageStore } from '@/stores/use-page-store';
import { useDatabaseStore } from '@/stores/use-database-store';
import { ArabicBlockEditor } from '@/components/editor/arabic-block-editor';
import { TableView } from '@/components/database/table-view';
import { KanbanBoard } from '@/components/database/kanban/kanban-board';
import { CalendarView } from '@/components/database/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, LayoutTemplate, CalendarDays, MoreHorizontal, Image as ImageIcon, Smile, Lock, Maximize2, Loader2, ChevronLeft, Star } from 'lucide-react';
import Link from 'next/link';

export default function SmartPage({ params }: { params: Promise<{ workspaceSlug: string; pageId: string }> }) {
  const resolvedParams = use(params);
  const workspaceSlug = decodeURIComponent(resolvedParams.workspaceSlug);
  const pageId = decodeURIComponent(resolvedParams.pageId);
  const { selectPage, activePage, isLoading, updatePage, fetchPageTree } = usePageStore();
  const { fetchDatabaseSchema } = useDatabaseStore();

  const [currentView, setCurrentView] = useState<'table' | 'kanban' | 'calendar'>('table');

  useEffect(() => {
    selectPage(pageId);
  }, [pageId, selectPage]);

  useEffect(() => {
    if (activePage && (activePage.isDatabase || activePage.type === 'DATABASE')) {
      fetchDatabaseSchema(pageId);
    }
  }, [activePage, pageId, fetchDatabaseSchema]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 h-full min-h-screen">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!activePage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 h-full min-h-screen text-slate-100">
        <h2 className="text-2xl font-bold text-rose-500 mb-4">الصفحة غير موجودة</h2>
        <Link href={`/${workspaceSlug}`}>
          <Button variant="outline">العودة للوحة التحكم</Button>
        </Link>
      </div>
    );
  }

  const isDatabase = activePage.isDatabase || activePage.type === 'DATABASE';

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 min-h-screen relative">
      {/* Cover Image Placeholder Area */}
      {activePage.coverUrl && (
        <div className="w-full h-48 md:h-64 relative group">
          <img src={activePage.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className={`max-w-5xl mx-auto space-y-6 relative z-10 p-6 md:p-10 ${activePage.coverUrl ? '-mt-12 md:-mt-16' : ''}`}>
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-400 gap-2 mb-8 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-lg w-fit border border-slate-800">
          <Link href={`/${workspaceSlug}`} className="hover:text-white transition-colors">مساحة العمل</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-slate-200 font-medium truncate max-w-[200px]">{activePage.title || 'بدون عنوان'}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 group">
          <div className="flex-1 space-y-4 w-full">
            <div className="text-6xl cursor-pointer hover:opacity-80 transition-opacity w-fit relative inline-block">
              {activePage.icon || '📄'}
            </div>
            
            <input
              type="text"
              value={activePage.title}
              onChange={(e) => updatePage(pageId, { title: e.target.value })}
              placeholder="بدون عنوان..."
              className="w-full bg-transparent text-4xl md:text-5xl font-black font-cairo text-white focus:outline-none placeholder-slate-600"
            />
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => updatePage(pageId, { isFavorite: !activePage.isFavorite })}
              className={`transition-colors ${activePage.isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-slate-400 hover:text-white'}`}
              title={activePage.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <Star className="w-5 h-5" fill={activePage.isFavorite ? "currentColor" : "none"} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800 text-slate-200">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                  <Smile className="w-4 h-4" /> إضافة أيقونة
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                  <ImageIcon className="w-4 h-4" /> إضافة غلاف
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updatePage(pageId, { fullWidth: !activePage.fullWidth })}
                  className="flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2"><Maximize2 className="w-4 h-4" /> عرض كامل</div>
                  {activePage.fullWidth && <span className="text-emerald-400 text-xs">مفعل</span>}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem 
                  onClick={() => updatePage(pageId, { isLocked: !activePage.isLocked })}
                  className={`flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-800 ${activePage.isLocked ? 'text-amber-400' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> 
                    {activePage.isLocked ? 'إلغاء قفل الصفحة' : 'قفل الصفحة'}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {isDatabase ? (
            <div className="space-y-6">
              {/* View Switcher for Database */}
              <div className="flex p-1 bg-slate-900/60 border border-slate-800 rounded-lg w-fit backdrop-blur-sm">
                <button
                  onClick={() => setCurrentView('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    currentView === 'table' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Table className="w-4 h-4" /> جدول
                </button>
                <button
                  onClick={() => setCurrentView('kanban')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    currentView === 'kanban' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4" /> كانبان
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    currentView === 'calendar' ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" /> تقويم
                </button>
              </div>

              {/* Database View Container */}
              <div className="border border-slate-800/80 bg-slate-900/40 rounded-xl overflow-hidden shadow-2xl">
                {currentView === 'table' && <TableView pageId={pageId} />}
                {currentView === 'kanban' && <KanbanBoard pageId={pageId} />}
                {currentView === 'calendar' && <CalendarView pageId={pageId} />}
              </div>
            </div>
          ) : (
            <div className="prose-container">
              <ArabicBlockEditor 
                content={activePage.content} 
                onChange={(content) => updatePage(pageId, { content })} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

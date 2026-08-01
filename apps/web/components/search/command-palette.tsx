'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { Search, FileText, Database, Settings, Trash2, Plus, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react';
import { usePageStore } from '@/stores/use-page-store';
import { IPageTreeNode } from '@masar/types';

interface CommandPaletteState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

interface CommandPaletteProps {
  workspaceSlug: string;
}

interface FlattenedPage extends IPageTreeNode {
  parentPath: string[];
}

function flattenPageTree(nodes: IPageTreeNode[], path: string[] = []): FlattenedPage[] {
  let result: FlattenedPage[] = [];
  for (const node of nodes) {
    result.push({ ...node, parentPath: path });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenPageTree(node.children, [...path, node.title]));
    }
  }
  return result;
}

export function CommandPalette({ workspaceSlug }: CommandPaletteProps) {
  const { isOpen, close, toggle } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { pageTree, createPage, activePage } = usePageStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allPages = flattenPageTree(pageTree);
  
  const filteredPages = query
    ? allPages.filter((page) => page.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const actions = [
    {
      id: 'create-page',
      title: 'إنشاء صفحة جديدة',
      icon: <Plus className="w-4 h-4 text-emerald-400" />,
      action: async () => {
        const workspaceId = activePage?.workspaceId || (pageTree[0] && pageTree[0].workspaceId);
        if (workspaceId) {
          const newPage = await createPage({ title: 'صفحة جديدة', workspaceId });
          if (newPage) router.push(`/${workspaceSlug}/${newPage.id}`);
        }
        close();
      },
    },
    {
      id: 'create-db',
      title: 'إنشاء قاعدة بيانات',
      icon: <Database className="w-4 h-4 text-blue-400" />,
      action: async () => {
        const workspaceId = activePage?.workspaceId || (pageTree[0] && pageTree[0].workspaceId);
        if (workspaceId) {
          const newPage = await createPage({ title: 'قاعدة بيانات جديدة', workspaceId, isDatabase: true });
          if (newPage) router.push(`/${workspaceSlug}/${newPage.id}`);
        }
        close();
      },
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      action: () => {
        // router.push(`/${workspaceSlug}/settings`);
        close();
      },
    },
    {
      id: 'trash',
      title: 'سلة المحذوفات',
      icon: <Trash2 className="w-4 h-4 text-red-400" />,
      action: () => {
        // router.push(`/${workspaceSlug}/trash`);
        close();
      },
    },
  ];

  const items = query ? filteredPages : actions;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = items[selectedIndex];
        if (selected) {
          if (query) {
            const page = selected as FlattenedPage;
            router.push(`/${workspaceSlug}/${page.id}`);
            close();
          } else {
            const action = selected as typeof actions[0];
            action.action();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex, close, router, workspaceSlug, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={close}
      />
      <div 
        className="relative w-full max-w-xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        dir="rtl"
      >
        <div className="flex items-center px-4 py-4 border-b border-white/5">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-lg"
            placeholder="ابحث في الصفحات والأوامر..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs text-slate-400 font-mono tracking-wider mr-3 shrink-0">
            Cmd+K
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2 scrollbar-hide">
          {query ? (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 font-cairo">الصفحات</div>
              {filteredPages.length > 0 ? (
                filteredPages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      router.push(`/${workspaceSlug}/${page.id}`);
                      close();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                      index === selectedIndex ? 'bg-emerald-500/10' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="w-6 flex justify-center text-lg">{page.icon || (page.isDatabase ? '🗄️' : '📄')}</div>
                    <div className="flex-1 overflow-hidden">
                      <div className={`truncate font-semibold ${index === selectedIndex ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {page.title}
                      </div>
                      {page.parentPath.length > 0 && (
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          {page.parentPath.join(' / ')}
                        </div>
                      )}
                    </div>
                    {index === selectedIndex && <CornerDownLeft className="w-4 h-4 text-emerald-500/50" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-400">
                  لا توجد نتائج لـ &quot;{query}&quot;
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 font-cairo">إجراءات سريعة</div>
              {actions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                    index === selectedIndex ? 'bg-emerald-500/10' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${index === selectedIndex ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                    {action.icon}
                  </div>
                  <div className={`flex-1 font-semibold ${index === selectedIndex ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {action.title}
                  </div>
                  {index === selectedIndex && <CornerDownLeft className="w-4 h-4 text-emerald-500/50" />}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 bg-slate-950/50 border-t border-white/5 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 bg-slate-800 rounded text-[10px]">
              <CornerDownLeft className="w-3 h-3" />
            </span>
            <span>اختيار</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 bg-slate-800 rounded">
              <ArrowUp className="w-3 h-3" />
            </span>
            <span className="flex items-center justify-center w-5 h-5 bg-slate-800 rounded">
              <ArrowDown className="w-3 h-3" />
            </span>
            <span>تنقل</span>
          </div>
          <div className="flex items-center gap-1.5 mr-auto">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">ESC</span>
            <span>إغلاق</span>
          </div>
        </div>
      </div>
    </div>
  );
}

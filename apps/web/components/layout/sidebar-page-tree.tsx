'use client';

import React, { useState } from 'react';
import { IPageTreeNode } from '@masar/types';
import { usePageStore } from '@/stores/use-page-store';
import { ChevronDown, ChevronLeft, Plus, FileText, Folder, Trash2 } from 'lucide-react';

interface PageTreeItemProps {
  node: IPageTreeNode;
  workspaceId: string;
  level?: number;
}

function PageTreeItem({ node, workspaceId, level = 0 }: PageTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { activePage, selectPage, createPage, deletePage } = usePageStore();

  const hasChildren = node.children && node.children.length > 0;
  const isActive = activePage?.id === node.id;

  const handleAddChild = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    await createPage({
      title: 'مستند فرعي جديد',
      icon: '📄',
      workspaceId,
      parentId: node.id,
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deletePage(node.id, workspaceId);
  };

  return (
    <div className="space-y-0.5">
      <div
        onClick={() => selectPage(node.id)}
        style={{ paddingRight: `${level * 16 + 12}px` }}
        className={`group flex items-center justify-between py-1.5 pl-3 rounded-xl text-xs cursor-pointer transition-colors ${
          isActive
            ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
            : 'text-slate-300 hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-0.5 hover:text-white transition-colors"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          <span className="text-sm">{node.icon || '📄'}</span>
          <span className="truncate">{node.title}</span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={handleAddChild}
            className="p-1 hover:bg-slate-700 rounded-lg text-emerald-400 transition-colors"
            title="إضافة مستند فرعي"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDelete}
            className="p-1 hover:bg-slate-700 rounded-lg text-rose-400 transition-colors"
            title="أرشفة المستند"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <PageTreeItem key={child.id} node={child} workspaceId={workspaceId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarPageTree({ workspaceId }: { workspaceId: string }) {
  const { pageTree, createPage } = usePageStore();

  const handleCreateRootPage = async () => {
    await createPage({
      title: 'مستند رئيسي جديد',
      icon: '📝',
      workspaceId,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-slate-400 font-cairo">المستندات والصفحات</span>
        <button
          onClick={handleCreateRootPage}
          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs transition-colors flex items-center gap-1 font-semibold"
          title="صفحة جديدة"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>صفحة جديدة</span>
        </button>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pl-1">
        {pageTree.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">لا توجد مستندات في هذه المساحة بعد</div>
        ) : (
          pageTree.map((node) => (
            <PageTreeItem key={node.id} node={node} workspaceId={workspaceId} />
          ))
        )}
      </div>
    </div>
  );
}

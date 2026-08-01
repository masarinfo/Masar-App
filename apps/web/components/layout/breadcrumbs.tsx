'use client';

import React, { useMemo } from 'react';
import { usePageStore } from '@/stores/use-page-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { ChevronLeft } from 'lucide-react';
import { IPageTreeNode } from '@masar/types';

interface BreadcrumbsProps {
  pageId: string;
}

export function Breadcrumbs({ pageId }: BreadcrumbsProps) {
  const { pageTree, selectPage } = usePageStore();
  const { activeWorkspace } = useWorkspaceStore();

  const path = useMemo(() => {
    const findPath = (nodes: IPageTreeNode[], currentPath: IPageTreeNode[]): IPageTreeNode[] | null => {
      for (const node of nodes) {
        if (node.id === pageId) {
          return [...currentPath, node];
        }
        if (node.children && node.children.length > 0) {
          const foundPath = findPath(node.children, [...currentPath, node]);
          if (foundPath) return foundPath;
        }
      }
      return null;
    };
    return findPath(pageTree, []) || [];
  }, [pageTree, pageId]);

  if (!activeWorkspace) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <div className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer rounded px-1.5 py-1 hover:bg-slate-800/60">
        <div className="w-4 h-4 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
          {activeWorkspace.name.charAt(0)}
        </div>
        <span className="font-cairo">{activeWorkspace.name}</span>
      </div>

      {path.map((node, index) => (
        <React.Fragment key={node.id}>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
          <div
            onClick={() => selectPage(node.id)}
            className={`flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer rounded px-1.5 py-1 hover:bg-slate-800/60 ${
              index === path.length - 1 ? 'text-slate-200 font-medium' : ''
            }`}
          >
            <span>{node.icon || '📄'}</span>
            <span className="truncate max-w-[120px]">{node.title}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

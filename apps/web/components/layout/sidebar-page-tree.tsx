'use client';

import React, { useState } from 'react';
import { IPageTreeNode } from '@masar/types';
import { usePageStore } from '@/stores/use-page-store';
import { ChevronDown, ChevronLeft, Plus, FileText, Folder, Trash2, Star, GripVertical } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';

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

  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: `drag-${node.id}`,
    data: { node }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `drop-${node.id}`,
    data: { node }
  });

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

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  } : undefined;

  return (
    <div className="space-y-0.5" ref={setDroppableRef}>
      <div
        ref={setDraggableRef}
        style={{ ...style, paddingRight: `${level * 16 + 12}px` }}
        className={`group flex items-center justify-between py-1.5 pl-3 rounded-xl text-xs transition-colors ${
          isActive
            ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
            : isOver
            ? 'bg-emerald-500/20 text-white ring-1 ring-emerald-500'
            : 'text-slate-300 hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners} 
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-slate-700 p-0.5 rounded text-slate-500 hover:text-slate-300 transition-opacity"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

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

          <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => selectPage(node.id)}>
            <span className="text-sm">{node.icon || '📄'}</span>
            <span className="truncate">{node.title}</span>
          </div>
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
  const { pageTree, createPage, updatePage } = usePageStore();

  const handleCreateRootPage = async () => {
    await createPage({
      title: 'مستند رئيسي جديد',
      icon: '📝',
      workspaceId,
    });
  };

  const getFavorites = (nodes: IPageTreeNode[]): IPageTreeNode[] => {
    let favs: IPageTreeNode[] = [];
    for (const node of nodes) {
      if (node.isFavorite) favs.push(node);
      if (node.children && node.children.length > 0) {
        favs = favs.concat(getFavorites(node.children));
      }
    }
    return favs;
  };

  const favorites = getFavorites(pageTree);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return; // same item

    // active.id is like "drag-123"
    // over.id is like "drop-456"
    const draggedNodeId = (active.id as string).replace('drag-', '');
    let targetNodeId: string | null = (over.id as string).replace('drop-', '');

    // Dropped on ROOT?
    if (targetNodeId === 'root') {
      targetNodeId = null;
    }

    if (draggedNodeId === targetNodeId) return;

    // Prevent dropping a parent into its own child
    // This is handled simply by the backend API returning 400 or updating.
    // For optimistic UI, we could update the store locally. We will just send the request.
    await updatePage(draggedNodeId, { parentId: targetNodeId });
  };

  const { setNodeRef: setRootDroppable } = useDroppable({
    id: 'drop-root',
    data: { isRoot: true }
  });

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {favorites.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-400 font-cairo flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                المفضلة
              </span>
            </div>
            <div className="space-y-1 pl-1">
              {favorites.map((node) => (
                <div key={`fav-${node.id}`} className="py-1 px-3 text-xs text-slate-300 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center gap-2 truncate">
                  <span>{node.icon || '📄'}</span>
                  <span className="truncate">{node.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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

          <div 
            ref={setRootDroppable}
            className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pl-1 pb-10"
          >
            {pageTree.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">لا توجد مستندات في هذه المساحة بعد</div>
            ) : (
              pageTree.map((node) => (
                <PageTreeItem key={node.id} node={node} workspaceId={workspaceId} />
              ))
            )}
            
            {/* Empty area at the bottom for dropping back to root */}
            <div className="h-10 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-xs text-slate-500 mt-2">
              اسحب إلى هنا لإعادته كجذر
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

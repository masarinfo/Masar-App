'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IDatabaseRow, IProperty } from '@masar/types';
import { KanbanCard } from './kanban-card';
import { Circle } from 'lucide-react';

interface KanbanColumnProps {
  id: string; // the option name/id
  title: string;
  color: string;
  rows: IDatabaseRow[];
  properties: IProperty[];
}

export function KanbanColumn({ id, title, color, rows, properties }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-72 max-h-full rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800/50 bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3" style={{ fill: color, color }} />
          <h3 className="text-sm font-bold text-white font-cairo">{title}</h3>
        </div>
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-slate-400 bg-slate-800 rounded-full">
          {rows.length}
        </span>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-2 min-h-[150px] transition-colors custom-scrollbar ${
          isOver ? 'bg-slate-800/30' : ''
        }`}
      >
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          {rows.map((row) => (
            <KanbanCard key={row.id} row={row} properties={properties} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

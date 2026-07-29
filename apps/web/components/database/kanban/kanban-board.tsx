'use client';

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDatabaseStore } from '@/stores/use-database-store';
import { IDatabaseRow, PagePropertyType } from '@masar/types';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';

interface KanbanBoardProps {
  pageId: string;
}

export function KanbanBoard({ pageId }: KanbanBoardProps) {
  const { properties, rows, updateCellData } = useDatabaseStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Find the first SELECT or MULTI_SELECT property to group by
  const groupByProperty = useMemo(
    () => properties.find((p) => p.type === PagePropertyType.SELECT || p.type === PagePropertyType.MULTI_SELECT),
    [properties],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag to activate (helps prevent accidental drags when clicking)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Derive columns from the groupByProperty options
  const columns = useMemo(() => {
    if (!groupByProperty || !groupByProperty.options) return [];
    
    // We also want a "No Status" or "Uncategorized" column for rows without this property set
    const cols = [
      { id: 'uncategorized', title: 'غير مصنف', color: '#64748b' }, // slate-500
      ...groupByProperty.options.map((opt: any) => ({
        id: opt.name, // using name as id for simplicity in matching cell data
        title: opt.name,
        color: opt.color || '#10b981', // default emerald
      })),
    ];
    return cols;
  }, [groupByProperty]);

  const getRowsForColumn = (columnId: string) => {
    if (!groupByProperty) return [];
    
    return rows.filter((row) => {
      const cellValue = row.data?.[groupByProperty.id];
      if (columnId === 'uncategorized') {
        return !cellValue || cellValue.trim() === '';
      }
      return cellValue === columnId;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || !groupByProperty) return;

    const activeRowId = active.id as string;
    
    // Check if we dropped over a column or over a card
    // The over.id could be the columnId OR another card's id
    let targetColumnId = over.id as string;
    
    // If dropped over a card, find which column that card belongs to
    const overRow = rows.find(r => r.id === over.id);
    if (overRow) {
      targetColumnId = overRow.data?.[groupByProperty.id] || 'uncategorized';
    }

    const activeRow = rows.find(r => r.id === activeRowId);
    if (!activeRow) return;

    const currentColumnId = activeRow.data?.[groupByProperty.id] || 'uncategorized';

    // If moved to a different column, update the data
    if (currentColumnId !== targetColumnId) {
      const newValue = targetColumnId === 'uncategorized' ? '' : targetColumnId;
      // Optimistic update happens in the store
      await updateCellData(activeRowId, pageId, groupByProperty.id, newValue);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40">
        أضف خصائص إلى قاعدة البيانات للبدء.
      </div>
    );
  }

  if (!groupByProperty) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40">
        يجب إضافة خاصية من نوع "تحديد منفرد (Select)" لاستخدام لوحة الكانبان وتجميع البيانات.
      </div>
    );
  }

  const activeRow = activeId ? rows.find((r) => r.id === activeId) : null;

  return (
    <div className="flex h-[600px] overflow-x-auto overflow-y-hidden gap-4 p-2 custom-scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            rows={getRowsForColumn(col.id)}
            properties={properties}
          />
        ))}

        <DragOverlay>
          {activeRow ? (
            <div className="w-64 opacity-90 shadow-2xl rotate-2">
              <KanbanCard row={activeRow} properties={properties} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

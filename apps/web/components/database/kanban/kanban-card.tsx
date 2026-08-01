'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IDatabaseRow, IProperty, PagePropertyType } from '@masar/types';
import { GripVertical } from 'lucide-react';
import { PROPERTY_TYPE_CONFIG } from '../property-type-selector';

interface KanbanCardProps {
  row: IDatabaseRow;
  properties: IProperty[];
}

export function KanbanCard({ row, properties }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Find a title property (usually a TEXT type, or just the first property) to display prominently
  const titleProperty = properties.find((p) => p.type === PagePropertyType.TEXT) || properties[0];
  const titleValue = titleProperty
    ? row.data?.[titleProperty.id] || 'بطاقة بدون عنوان'
    : 'بطاقة بدون عنوان';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col p-3 mb-2 rounded-xl border bg-slate-900 shadow-sm transition-all ${
        isDragging
          ? 'opacity-50 border-emerald-500 shadow-xl scale-105 z-50'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-bold text-white font-cairo truncate">{titleValue}</h4>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-emerald-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Render other properties as small badges/text */}
      <div className="flex flex-col gap-1.5 mt-1">
        {properties
          .filter((p) => p.id !== titleProperty?.id) // Don't show title again
          .map((prop) => {
            const val = row.data?.[prop.id];
            if (!val) return null;

            const config =
              PROPERTY_TYPE_CONFIG[prop.type as PagePropertyType] ||
              PROPERTY_TYPE_CONFIG[PagePropertyType.TEXT];
            const Icon = config.icon;

            return (
              <div
                key={prop.id}
                className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate"
              >
                <Icon className={`w-3 h-3 ${config.color}`} />
                <span className="truncate">{val}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

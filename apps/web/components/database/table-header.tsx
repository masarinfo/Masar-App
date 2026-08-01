'use client';

import React from 'react';
import { IProperty, PagePropertyType } from '@masar/types';
import { Header } from '@tanstack/react-table';
import { PROPERTY_TYPE_CONFIG } from './property-type-selector';

interface TableHeaderProps {
  header: Header<any, unknown>;
  property: IProperty;
}

export function TableHeader({ header, property }: TableHeaderProps) {
  const config =
    PROPERTY_TYPE_CONFIG[property.type as PagePropertyType] ||
    PROPERTY_TYPE_CONFIG[PagePropertyType.TEXT];
  const Icon = config.icon;

  return (
    <div className="relative flex items-center justify-between group h-full px-3 py-2 select-none">
      <div className="flex items-center gap-2 truncate text-slate-300 hover:text-white transition-colors cursor-pointer">
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        <span className="text-xs font-bold font-cairo truncate">{property.name}</span>
      </div>

      {/* Resizer */}
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500/50 hover:w-1.5 transition-all z-10 ${
          header.column.getIsResizing() ? 'bg-emerald-500 w-1.5' : 'bg-transparent'
        }`}
      />
    </div>
  );
}

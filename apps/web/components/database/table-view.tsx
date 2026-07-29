'use client';

import React, { useMemo, useRef, useState } from 'react';
import { IProperty, IDatabaseRow } from '@masar/types';
import { useDatabaseStore } from '@/stores/use-database-store';
import { TableCell } from './table-cell';
import { TableHeader } from './table-header';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Trash2, GripVertical } from 'lucide-react';

interface TableViewProps {
  pageId: string;
}

export function TableView({ pageId }: TableViewProps) {
  const { properties, rows, deleteRow } = useDatabaseStore();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Define columns dynamically based on `properties`
  const columns = useMemo<ColumnDef<IDatabaseRow>[]>(() => {
    const dynamicColumns = properties.map((prop) => ({
      id: prop.id,
      header: (info: any) => <TableHeader header={info.header} property={prop} />,
      cell: (info: any) => <TableCell row={info.row.original} property={prop} pageId={pageId} />,
      size: 200,
      minSize: 100,
    }));

    return [
      {
        id: 'actions',
        header: () => <div className="text-center text-xs font-bold text-slate-500 w-10">#</div>,
        cell: (info) => (
          <div className="flex items-center justify-center gap-1 opacity-20 hover:opacity-100 transition-opacity">
            <button className="cursor-grab hover:text-emerald-400">
              <GripVertical className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteRow(info.row.original.id, pageId)}
              className="text-rose-400 hover:text-rose-300"
              title="حذف الصف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        size: 60,
        enableResizing: false,
      },
      ...dynamicColumns,
    ] as ColumnDef<IDatabaseRow>[];
  }, [properties, pageId, deleteRow]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  const { rows: tableRows } = table.getRowModel();

  // Virtualizer for rows
  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  if (properties.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40">
        الجدول فارغ. أضف بعض الخصائص (الأعمدة) للبدء.
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className="relative w-full max-h-[600px] overflow-auto border border-slate-800/80 rounded-xl bg-slate-950/40 shadow-xl custom-scrollbar dir-ltr"
      style={{ direction: 'ltr' }} // Force LTR for table layout consistency, cell contents handle RTL
    >
      <div
        className="grid"
        style={{
          width: table.getTotalSize(),
        }}
      >
        {/* Table Head */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="relative flex items-center border-r border-slate-800/50 last:border-r-0"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Table Body (Virtualized) */}
        <div
          className="relative w-full"
          style={{ height: rowVirtualizer.getTotalSize() }}
        >
          {virtualRows.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500 py-10">
              لا توجد صفوف بيانات.
            </div>
          ) : (
            virtualRows.map((virtualRow) => {
              const row = tableRows[virtualRow.index];
              return (
                <div
                  key={row.id}
                  className="absolute top-0 left-0 flex w-full border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors group"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="flex items-center border-r border-slate-800/50 last:border-r-0 overflow-hidden"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

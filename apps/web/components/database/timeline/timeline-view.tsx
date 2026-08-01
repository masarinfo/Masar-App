'use client';

import React, { useState } from 'react';
import { PagePropertyType } from '@masar/types';
import { useDatabaseStore } from '@/stores/use-database-store';

interface TimelineViewProps {
  pageId: string;
}

export function TimelineView({ pageId }: TimelineViewProps) {
  const { properties, rows } = useDatabaseStore();
  const [scale, setScale] = useState<'day' | 'week' | 'month'>('day');

  const dateProperty = properties.find((p) => p.type === PagePropertyType.DATE);
  const titleProperty = properties.find((p) => p.type === PagePropertyType.TEXT) || properties[0];

  if (!dateProperty) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-sm">
        أضف حقل تاريخ لعرض الجدول الزمني
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-slate-800/80 rounded-xl bg-slate-950/40 overflow-hidden relative shadow-lg backdrop-blur-md">
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
        <h3 className="text-slate-300 font-medium">الجدول الزمني</h3>
        <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
          <button
            onClick={() => setScale('day')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${scale === 'day' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            يوم
          </button>
          <button
            onClick={() => setScale('week')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${scale === 'week' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            أسبوع
          </button>
          <button
            onClick={() => setScale('month')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${scale === 'month' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            شهر
          </button>
        </div>
      </div>

      <div className="flex min-h-[300px] overflow-x-auto relative custom-scrollbar">
        {/* Row labels */}
        <div className="w-48 flex-shrink-0 border-l border-slate-800 bg-slate-900/80 z-10 backdrop-blur-md">
          <div className="h-10 border-b border-slate-800"></div>
          {rows.map((row) => (
            <div
              key={row.id}
              className="h-12 flex items-center px-4 border-b border-slate-800/50 text-sm text-slate-300 truncate hover:bg-slate-800/30 transition-colors"
            >
              {titleProperty ? row.data[titleProperty.id] || 'بدون عنوان' : 'بدون عنوان'}
            </div>
          ))}
        </div>

        {/* Timeline area */}
        <div className="flex-1 relative min-w-[800px] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:40px_100%]">
          {/* Today line marker */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-500/50 z-0"></div>

          <div className="h-10 border-b border-slate-800 flex items-center text-xs text-slate-500 px-2 bg-slate-900/30">
            {/* Markers depending on scale */}
          </div>

          {rows.map((row) => {
            const dateValue = row.data[dateProperty.id];
            // Mock visualization layout
            const offset = Math.random() * 400 + 50;
            const width = Math.random() * 200 + 100;

            return (
              <div
                key={row.id}
                className="h-12 relative flex items-center border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
              >
                {dateValue && (
                  <div
                    className="absolute h-8 bg-emerald-500/20 border border-emerald-500/50 rounded-md flex items-center px-3 text-xs text-emerald-300 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:bg-emerald-500/30 transition-colors"
                    style={{ left: `${offset}px`, width: `${width}px` }}
                    title={String(dateValue)}
                  >
                    {String(dateValue)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

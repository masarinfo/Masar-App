'use client';

import React from 'react';
import { isToday, isSameMonth, format } from 'date-fns';
import { IDatabaseRow, IProperty, PagePropertyType } from '@masar/types';
import { PROPERTY_TYPE_CONFIG } from '../property-type-selector';

interface CalendarDayProps {
  day: Date;
  monthStart: Date;
  rows: IDatabaseRow[];
  properties: IProperty[];
}

export function CalendarDay({ day, monthStart, rows, properties }: CalendarDayProps) {
  const isCurrentMonth = isSameMonth(day, monthStart);
  const isCurrentDay = isToday(day);

  // Format Hijri date natively
  const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'short',
  });
  const hijriDateStr = hijriFormatter.format(day); // e.g. "١٥ رجب" or "15 رجب" depending on browser locale digits

  // Find title property
  const titleProperty = properties.find((p) => p.type === PagePropertyType.TEXT) || properties[0];

  return (
    <div
      className={`min-h-[120px] p-2 border-b border-l border-slate-800/50 flex flex-col gap-1 transition-colors ${
        !isCurrentMonth ? 'bg-slate-950/50 opacity-40' : 'bg-slate-900/20 hover:bg-slate-900/60'
      }`}
    >
      {/* Day Header */}
      <div className="flex items-start justify-between">
        <div
          className={`flex items-center justify-center w-6 h-6 text-sm font-bold rounded-full ${
            isCurrentDay
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-300'
          }`}
        >
          {format(day, 'd')}
        </div>
        <div className="text-[10px] text-slate-500 font-cairo" dir="rtl">
          {hijriDateStr}
        </div>
      </div>

      {/* Events / Rows */}
      <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[85px] custom-scrollbar">
        {rows.map((row) => {
          const titleValue = titleProperty
            ? row.data?.[titleProperty.id] || 'بدون عنوان'
            : 'بدون عنوان';
          return (
            <div
              key={row.id}
              className="px-2 py-1 text-[10px] font-bold text-slate-200 bg-indigo-500/20 border border-indigo-500/30 rounded truncate cursor-pointer hover:bg-indigo-500/40 transition-colors"
              title={titleValue}
            >
              {titleValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}

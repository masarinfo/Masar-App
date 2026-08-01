'use client';

import React, { useMemo, useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useDatabaseStore } from '@/stores/use-database-store';
import { PagePropertyType } from '@masar/types';
import { CalendarDay } from './calendar-day';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  pageId: string;
}

export function CalendarView({ pageId }: CalendarViewProps) {
  const { properties, rows } = useDatabaseStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Find the first DATE property to group by
  const dateProperty = useMemo(
    () => properties.find((p) => p.type === PagePropertyType.DATE),
    [properties],
  );

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  // Using Saturday as start of week for Arab world (or Sunday, date-fns uses 0=Sun, 6=Sat). Let's use Saturday (6).
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 6 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getRowsForDay = (day: Date) => {
    if (!dateProperty) return [];

    return rows.filter((row) => {
      const cellValue = row.data?.[dateProperty.id];
      if (!cellValue) return false;

      try {
        const rowDate = parseISO(cellValue); // assuming stored as ISO string (YYYY-MM-DD)
        return isSameDay(rowDate, day);
      } catch (e) {
        return false;
      }
    });
  };

  const weekDays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  if (properties.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40">
        أضف خصائص إلى قاعدة البيانات للبدء.
      </div>
    );
  }

  if (!dateProperty) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40">
        يجب إضافة خاصية من نوع "تاريخ (Date)" لاستخدام عرض التقويم.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white font-cairo">
            {format(currentDate, 'MMMM yyyy', { locale: arSA })}
          </h2>
        </div>
        <div className="flex items-center gap-2" dir="ltr">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={today}
            className="h-8 px-4 font-cairo font-bold"
          >
            اليوم
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-800/80 bg-slate-900/40">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-bold text-slate-400 font-cairo">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
        {days.map((day, i) => (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            monthStart={monthStart}
            rows={getRowsForDay(day)}
            properties={properties}
          />
        ))}
      </div>
    </div>
  );
}

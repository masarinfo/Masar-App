'use client';

import React from 'react';
import { PagePropertyType } from '@masar/types';
import { useDatabaseStore } from '@/stores/use-database-store';
import { FileText, ChevronLeft } from 'lucide-react';

interface ListViewProps {
  pageId: string;
}

export function ListView({ pageId }: ListViewProps) {
  const { properties, rows } = useDatabaseStore();

  const titleProperty = properties.find((p) => p.type === PagePropertyType.TEXT) || properties[0];
  const otherProperties = properties.filter((p) => p.id !== titleProperty?.id).slice(0, 3);

  if (properties.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-sm">
        الجدول فارغ. أضف بعض الخصائص للبدء.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {rows.map((row) => {
        const titleValue = titleProperty ? row.data[titleProperty.id] : row.id;

        return (
          <div
            key={row.id}
            className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-md border border-slate-800/50 rounded-xl cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <span className="font-medium text-slate-300 group-hover:text-slate-100">
                {titleValue || 'بدون عنوان'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {otherProperties.map((prop) => {
                  const val = row.data[prop.id];
                  if (!val) return null;
                  return (
                    <span
                      key={prop.id}
                      className="px-2 py-0.5 bg-slate-800/50 border border-slate-700/30 rounded-md text-xs text-slate-400"
                    >
                      {String(val)}
                    </span>
                  );
                })}
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import React from 'react';
import { IProperty, PagePropertyType } from '@masar/types';
import { useDatabaseStore } from '@/stores/use-database-store';
import { Image as ImageIcon } from 'lucide-react';

interface GalleryViewProps {
  pageId: string;
}

export function GalleryView({ pageId }: GalleryViewProps) {
  const { properties, rows } = useDatabaseStore();

  const titleProperty = properties.find((p) => p.type === PagePropertyType.TEXT) || properties[0];
  const fileProperty = properties.find((p) => p.type === PagePropertyType.FILES);
  const otherProperties = properties
    .filter((p) => p.id !== titleProperty?.id && p.id !== fileProperty?.id)
    .slice(0, 3);

  if (properties.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-md">
        الجدول فارغ. أضف بعض الخصائص للبدء.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {rows.map((row) => {
        const titleValue = titleProperty ? row.data[titleProperty.id] : row.id;
        const coverImage = fileProperty && row.data[fileProperty.id]?.[0]?.url;

        return (
          <div
            key={row.id}
            className="flex flex-col bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors shadow-lg group cursor-pointer"
          >
            <div className="h-32 w-full bg-gradient-to-br from-slate-800 to-slate-900 relative">
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-slate-200 text-lg line-clamp-1">
                {titleValue || 'بدون عنوان'}
              </h3>
              <div className="flex flex-wrap gap-2 mt-auto">
                {otherProperties.map((prop) => {
                  const val = row.data[prop.id];
                  if (!val) return null;
                  return (
                    <span
                      key={prop.id}
                      className="px-2 py-1 bg-slate-800/50 rounded-md text-xs text-slate-400 border border-slate-700/50"
                    >
                      {prop.name}: {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

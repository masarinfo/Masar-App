'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DatabaseTemplatePickerProps {
  onSelect: (template: string | null) => void;
  onClose: () => void;
}

const DATABASE_TEMPLATES = [
  {
    id: 'tasks',
    icon: '📋',
    name: 'تتبع المهام',
    description: 'أعمدة: العنوان, الحالة, الأولوية, المسؤول, التاريخ',
  },
  {
    id: 'crm',
    icon: '👥',
    name: 'إدارة عملاء',
    description: 'أعمدة: الاسم, البريد, الهاتف, الحالة, الملاحظات',
  },
  {
    id: 'budget',
    icon: '📊',
    name: 'ميزانية',
    description: 'أعمدة: البند, المبلغ, الفئة, التاريخ, مدفوع',
  },
  {
    id: 'reading_list',
    icon: '📖',
    name: 'قائمة قراءة',
    description: 'أعمدة: العنوان, المؤلف, التقييم, تم القراءة, الرابط',
  },
  {
    id: 'empty',
    icon: '⬜',
    name: 'فارغ',
    description: 'ابدأ بدون أعمدة إضافية',
  },
];

export function DatabaseTemplatePicker({ onSelect, onClose }: DatabaseTemplatePickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 dir-rtl">
      <div
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold font-cairo text-white">اختر قالب قاعدة البيانات</h2>
            <p className="text-slate-400 mt-1 text-sm">
              اختر هيكل مبدئي لقاعدة بياناتك أو ابدأ من الصفر
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATABASE_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group"
              onClick={() => onSelect(template.id)}
            >
              <CardHeader className="pb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

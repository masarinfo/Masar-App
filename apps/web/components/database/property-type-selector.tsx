'use client';

import React from 'react';
import { PagePropertyType } from '@masar/types';
import {
  Type,
  Hash,
  ChevronDownSquare,
  ListFilter,
  Calendar,
  User,
  Paperclip,
  CheckSquare,
  Link,
  Mail,
  Calculator,
  GitMerge,
  Layers,
} from 'lucide-react';

export const PROPERTY_TYPE_CONFIG: Record<
  PagePropertyType,
  { label: string; icon: any; color: string; description: string }
> = {
  [PagePropertyType.TEXT]: {
    label: 'نص عادي (Text)',
    icon: Type,
    color: 'text-emerald-400',
    description: 'نص قصير أو عنوان أو ملاحظة',
  },
  [PagePropertyType.NUMBER]: {
    label: 'رقم (Number)',
    icon: Hash,
    color: 'text-cyan-400',
    description: 'أعداد أو مبالغ مالية أو نسب',
  },
  [PagePropertyType.SELECT]: {
    label: 'تحديد منفرد (Select)',
    icon: ChevronDownSquare,
    color: 'text-amber-400',
    description: 'خيار واحد من قائمة ملونة',
  },
  [PagePropertyType.MULTI_SELECT]: {
    label: 'تحديد متعدد (Multi-Select)',
    icon: ListFilter,
    color: 'text-purple-400',
    description: 'عدة خيارات ملونة معاً',
  },
  [PagePropertyType.DATE]: {
    label: 'تاريخ (Date)',
    icon: Calendar,
    color: 'text-rose-400',
    description: 'تاريخ وموعد أو نطاق زمني',
  },
  [PagePropertyType.PERSON]: {
    label: 'مسؤول / شخص (Person)',
    icon: User,
    color: 'text-blue-400',
    description: 'تعيين عضو من فريق مساحة العمل',
  },
  [PagePropertyType.FILES]: {
    label: 'ملفات (Files)',
    icon: Paperclip,
    color: 'text-[#10b981]',
    description: 'رفع مستندات أو صور ومرفقات',
  },
  [PagePropertyType.CHECKBOX]: {
    label: 'مربع اختيار (Checkbox)',
    icon: CheckSquare,
    color: 'text-emerald-400',
    description: 'حالة تم / لم يتم (True/False)',
  },
  [PagePropertyType.URL]: {
    label: 'رابط موقع (URL)',
    icon: Link,
    color: 'text-cyan-400',
    description: 'رابط خارجي قابل للنقر',
  },
  [PagePropertyType.EMAIL]: {
    label: 'بريد إلكتروني (Email)',
    icon: Mail,
    color: 'text-indigo-400',
    description: 'عنوان بريد إلكتروني رسمي',
  },
  [PagePropertyType.FORMULA]: {
    label: 'معادلة حسابية (Formula)',
    icon: Calculator,
    color: 'text-amber-400',
    description: 'حساب تلقائي مبني على الخانات',
  },
  [PagePropertyType.RELATION]: {
    label: 'علاقة (Relation)',
    icon: GitMerge,
    color: 'text-pink-400',
    description: 'ربط بجدول أو قاعدة بيانات أخرى',
  },
  [PagePropertyType.ROLLUP]: {
    label: 'تجميع البيانات (Rollup)',
    icon: Layers,
    color: 'text-purple-400',
    description: 'تجميع وحساب قيم من العلاقات',
  },
};

interface PropertyTypeSelectorProps {
  value: PagePropertyType;
  onChange: (type: PagePropertyType) => void;
}

export function PropertyTypeSelector({ value, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
      {Object.entries(PROPERTY_TYPE_CONFIG).map(([typeKey, config]) => {
        const Icon = config.icon;
        const isSelected = value === typeKey;

        return (
          <button
            key={typeKey}
            type="button"
            onClick={() => onChange(typeKey as PagePropertyType)}
            className={`flex items-start gap-3 p-3 rounded-xl border text-right transition-all ${
              isSelected
                ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
            }`}
          >
            <div className={`p-2 rounded-lg bg-slate-900 ${config.color} shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold font-cairo text-white">{config.label}</p>
              <p className="text-[10px] text-slate-400 truncate">{config.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

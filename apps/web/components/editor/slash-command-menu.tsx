'use client';

import React, { useEffect, useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Quote,
  AlertCircle,
  CheckSquare,
  Code,
  List,
  ListOrdered,
  Type,
} from 'lucide-react';

interface SlashMenuProps {
  editor: any;
  isOpen: boolean;
  onClose: () => void;
}

export function SlashCommandMenu({ editor, isOpen, onClose }: SlashMenuProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = [
    {
      title: 'عنوان رئيسي (H1)',
      description: 'عنوان مقطع كبير بارز',
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: 'عنوان فرعي (H2)',
      description: 'عنوان قسم متوسط',
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: 'عنوان صغير (H3)',
      description: 'عنوان تفصيلي فرعي',
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: 'تنبيه عربي (Callout)',
      description: 'مربع تنبيه بارز مع أيقونة ملونة',
      icon: AlertCircle,
      command: () => editor.chain().focus().toggleArabicCallout({ icon: '💡', type: 'info' }).run(),
    },
    {
      title: 'اقتباس عربي (Quote)',
      description: 'اقتباس مزخرف بشريط جانبي زمردي',
      icon: Quote,
      command: () => editor.chain().focus().toggleArabicQuote().run(),
    },
    {
      title: 'قائمة مهام (Task List)',
      description: 'قائمة مربعات اختيار لإنجاز المهام',
      icon: CheckSquare,
      command: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      title: 'قائمة نقطية (Bullet List)',
      description: 'قائمة عناصر غير مرتبة',
      icon: List,
      command: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: 'قائمة رقمية (Ordered List)',
      description: 'قائمة عناصر مرتبة بالأرقام',
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: 'كود برمجي (Code Block)',
      description: 'مربع تنسيق الشفرة البرمجية',
      icon: Code,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: 'نص عالي (Paragraph)',
      description: 'فقرة نصية عادية',
      icon: Type,
      command: () => editor.chain().focus().setParagraph().run(),
    },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="w-full max-w-sm p-2 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl space-y-2 animate-in zoom-in-95">
        <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-sm">/</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن البلوك المناسب..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 p-1">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">لا توجد نتائج مطابقة</div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.title}
                  onClick={() => {
                    item.command();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold font-cairo text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

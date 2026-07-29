'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  AlertCircle,
  Highlighter,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: any;
  onOpenSlashMenu: () => void;
}

export function EditorToolbar({ editor, onOpenSlashMenu }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-xl text-slate-300 mb-6">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('bold') ? 'bg-emerald-500/20 text-emerald-400 font-bold' : ''
        }`}
        title="عريض (Bold)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('italic') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="مائل (Italic)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('strike') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="شطب (Strike)"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="عنوان 1 (H1)"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="عنوان 2 (H2)"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleArabicCallout({ icon: '💡', type: 'info' }).run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('arabicCallout') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="تنبيه عربي (Callout)"
      >
        <AlertCircle className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleArabicQuote().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('arabicQuote') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="اقتباس عربي (Quote)"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('taskList') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="قائمة مهام (Task list)"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('bulletList') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="قائمة نقطية"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('orderedList') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="قائمة رقمية"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-800 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#059669' }).run()}
        className={`p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${
          editor.isActive('highlight') ? 'bg-emerald-500/20 text-emerald-400' : ''
        }`}
        title="تظليل زمردي"
      >
        <Highlighter className="w-4 h-4 text-emerald-400" />
      </button>

      <button
        onClick={onOpenSlashMenu}
        className="mr-auto px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
      >
        <span>قائمة / الأوامر</span>
      </button>
    </div>
  );
}

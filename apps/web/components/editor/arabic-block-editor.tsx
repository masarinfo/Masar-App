'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { TextDirection } from './extensions/text-direction';
import { ArabicCallout } from './extensions/arabic-callout';
import { ArabicQuote } from './extensions/arabic-quote';
import { EditorToolbar } from './editor-toolbar';
import { SlashCommandMenu } from './slash-command-menu';
import { AiCopilotDialog } from './ai-copilot-dialog';
import { Sparkles } from 'lucide-react';

interface ArabicBlockEditorProps {
  content?: any;
  onChange?: (json: any) => void;
  placeholder?: string;
}

export function ArabicBlockEditor({
  content,
  onChange,
  placeholder = 'اكتب هنا مباشرة أو ادخل رمز / لاستدعاء الأوامر والتنبيهات والبلوكات...',
}: ArabicBlockEditorProps) {
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      TextDirection,
      ArabicCallout,
      ArabicQuote,
    ],
    content: content || `
      <h1 dir="auto">أهلاً بك في محرر مسار التكتلي الفائق (Masar Block Editor) 🚀</h1>
      <p dir="auto">هذا المحرر يدعم كتابة النصوص العربية والإنجليزية المتداخلة مع الأكواد البرمجية والجداول بسلاسة وسرعة فائقة.</p>
      <div data-type="arabic-callout" data-icon="💡" data-type="info" dir="auto">
        <strong>تنبيه هامي:</strong> يمكنك استخدام رمز <code>/</code> في أي سطر جديد لإظهار قائمة البلوكات السريعة كالتنبيهات والأشكال والاقتباسات.
      </div>
      <blockquote data-type="arabic-quote" dir="auto">
        "الإنتاجية ليست القيام بأشياء أكثر، بل القيام بالأشياء الصحيحة بأفضل صورة ممكنة."
      </blockquote>
    `,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[350px] p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl focus:outline-none text-slate-100 font-readex leading-relaxed dir-rtl text-right select-text',
      },
      handleKeyDown(view, event) {
        if (event.key === '/') {
          setIsSlashMenuOpen(true);
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text);
    },
  });

  const handleAiInsert = (text: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`\n${text}`).run();
  };

  const handleAiReplace = (text: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(text).run();
  };

  return (
    <div className="w-full relative">
      <EditorToolbar editor={editor} onOpenSlashMenu={() => setIsSlashMenuOpen(true)} />
      <EditorContent editor={editor} />
      <SlashCommandMenu
        editor={editor}
        isOpen={isSlashMenuOpen}
        onClose={() => setIsSlashMenuOpen(false)}
      />
      
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex">
          <button
            onClick={() => setIsAiDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-emerald-500/50 hover:bg-emerald-950 text-emerald-400 text-xs font-bold rounded-lg shadow-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI ✨</span>
          </button>
        </BubbleMenu>
      )}

      <AiCopilotDialog
        isOpen={isAiDialogOpen}
        onClose={() => setIsAiDialogOpen(false)}
        selectedText={selectedText}
        onInsert={handleAiInsert}
        onReplace={handleAiReplace}
      />
    </div>
  );
}

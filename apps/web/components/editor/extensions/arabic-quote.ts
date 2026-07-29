import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    arabicQuote: {
      setArabicQuote: () => ReturnType;
      toggleArabicQuote: () => ReturnType;
    };
  }
}

export const ArabicQuote = Node.create({
  name: 'arabicQuote',
  group: 'block',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [{ tag: 'blockquote[data-type="arabic-quote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'blockquote',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'arabic-quote',
        class:
          'p-4 my-4 border-r-4 border-emerald-500 bg-slate-900/60 rounded-l-2xl text-slate-200 font-tajawal italic text-base leading-relaxed backdrop-blur-sm',
        dir: 'auto',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setArabicQuote:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
      toggleArabicQuote:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph');
        },
    };
  },
});

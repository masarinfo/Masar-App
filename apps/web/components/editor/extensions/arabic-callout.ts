import { Node, mergeAttributes } from '@tiptap/core';

export interface ArabicCalloutOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    arabicCallout: {
      setArabicCallout: (options?: { icon?: string; type?: string }) => ReturnType;
      toggleArabicCallout: (options?: { icon?: string; type?: string }) => ReturnType;
    };
  }
}

export const ArabicCallout = Node.create<ArabicCalloutOptions>({
  name: 'arabicCallout',
  group: 'block',
  content: 'inline*',
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      icon: {
        default: '💡',
        parseHTML: (element) => element.getAttribute('data-icon') || '💡',
        renderHTML: (attributes) => ({ 'data-icon': attributes.icon }),
      },
      type: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-type') || 'info',
        renderHTML: (attributes) => ({ 'data-type': attributes.type }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="arabic-callout"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const typeClasses: Record<string, string> = {
      info: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
      warning: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
      danger: 'bg-rose-950/40 border-rose-500/40 text-rose-200',
      note: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200',
    };

    const type = node.attrs.type || 'info';
    const bgClass = typeClasses[type] || typeClasses.info;

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'arabic-callout',
        class: `p-4 my-3 rounded-2xl border backdrop-blur-md flex items-start gap-3 text-sm font-medium ${bgClass}`,
        dir: 'auto',
      }),
      ['span', { class: 'text-xl select-none leading-none pt-0.5' }, node.attrs.icon || '💡'],
      ['div', { class: 'flex-1 leading-relaxed' }, 0],
    ];
  },

  addCommands() {
    return {
      setArabicCallout:
        (options) =>
        ({ commands }) => {
          return commands.setNode(this.name, options);
        },
      toggleArabicCallout:
        (options) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', options);
        },
    };
  },
});

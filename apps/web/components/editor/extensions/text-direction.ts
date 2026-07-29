import { Extension } from '@tiptap/core';

export const TextDirection = Extension.create({
  name: 'textDirection',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'taskList', 'arabicCallout', 'arabicQuote'],
        attributes: {
          dir: {
            default: 'auto',
            parseHTML: (element) => element.getAttribute('dir') || 'auto',
            renderHTML: (attributes) => {
              if (!attributes.dir) {
                return {};
              }
              return { dir: attributes.dir };
            },
          },
        },
      },
    ];
  },
});

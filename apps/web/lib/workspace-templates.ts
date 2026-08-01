import { PageType } from '@masar/types';

export interface WorkspaceTemplate {
  id: string;
  icon: string;
  name: string;
  description: string;
  pages: {
    title: string;
    icon: string;
    isDatabase: boolean;
    type: PageType;
  }[];
}

export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: 'project',
    icon: '📋',
    name: 'إدارة مشروع',
    description: 'مهام وأهداف ومتابعة التقدم',
    pages: [
      { title: 'لوحة المهام', icon: '📋', isDatabase: true, type: 'DATABASE' },
      { title: 'الجدول الزمني', icon: '📅', isDatabase: true, type: 'DATABASE' },
      { title: 'ملاحظات الاجتماعات', icon: '📝', isDatabase: false, type: 'DOCUMENT' },
      { title: 'وثائق المشروع', icon: '📄', isDatabase: false, type: 'DOCUMENT' },
      { title: 'الأهداف والنتائج', icon: '🎯', isDatabase: true, type: 'DATABASE' },
    ],
  },
  {
    id: 'team',
    icon: '👥',
    name: 'فريق عمل',
    description: 'تعاون وتنسيق مع فريقك',
    pages: [
      { title: 'دليل الفريق', icon: '👥', isDatabase: false, type: 'DOCUMENT' },
      { title: 'أجندة الفريق', icon: '📅', isDatabase: true, type: 'DATABASE' },
      { title: 'المشاريع الحالية', icon: '🚀', isDatabase: true, type: 'DATABASE' },
      { title: 'ملاحظات عامة', icon: '📓', isDatabase: false, type: 'DOCUMENT' },
    ],
  },
  {
    id: 'study',
    icon: '📚',
    name: 'دراسة وتعلم',
    description: 'ملاحظات ومراجع وجداول',
    pages: [
      { title: 'الجدول الدراسي', icon: '📅', isDatabase: true, type: 'DATABASE' },
      { title: 'المقررات', icon: '📘', isDatabase: true, type: 'DATABASE' },
      { title: 'ملاحظات المحاضرات', icon: '📝', isDatabase: false, type: 'DOCUMENT' },
      { title: 'المراجع والكتب', icon: '📚', isDatabase: true, type: 'DATABASE' },
    ],
  },
  {
    id: 'freelancer',
    icon: '💼',
    name: 'عمل حر',
    description: 'عملاء ومشاريع وفواتير',
    pages: [
      { title: 'قاعدة العملاء', icon: '👥', isDatabase: true, type: 'DATABASE' },
      { title: 'المشاريع المستقلة', icon: '💻', isDatabase: true, type: 'DATABASE' },
      { title: 'الفواتير والمدفوعات', icon: '💰', isDatabase: true, type: 'DATABASE' },
      { title: 'مستندات العمل', icon: '📄', isDatabase: false, type: 'DOCUMENT' },
    ],
  },
  {
    id: 'blog',
    icon: '📝',
    name: 'مدونة ومحتوى',
    description: 'كتابة ونشر وتخطيط',
    pages: [
      { title: 'خطة المحتوى', icon: '📅', isDatabase: true, type: 'DATABASE' },
      { title: 'الأفكار والمسودات', icon: '💡', isDatabase: true, type: 'DATABASE' },
      { title: 'المقالات المنشورة', icon: '📝', isDatabase: true, type: 'DATABASE' },
      { title: 'أرشيف المقالات', icon: '🗃️', isDatabase: false, type: 'DOCUMENT' },
    ],
  },
  {
    id: 'empty',
    icon: '⬜',
    name: 'فارغ',
    description: 'ابدأ من الصفر',
    pages: [],
  }
];

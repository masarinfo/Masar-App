'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { WORKSPACE_TEMPLATES, WorkspaceTemplate } from '@/lib/workspace-templates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePageStore } from '@/stores/use-page-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'project', label: 'مشاريع' },
  { id: 'team', label: 'فرق' },
  { id: 'study', label: 'دراسة' },
  { id: 'business', label: 'أعمال' },
];

export default function TemplateGalleryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const createPage = usePageStore((state) => state.createPage);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const filteredTemplates = useMemo(() => {
    return WORKSPACE_TEMPLATES.filter((template) => {
      const matchesSearch = template.name.includes(searchQuery) || template.description.includes(searchQuery);
      
      let matchesTab = true;
      if (activeTab !== 'all') {
        if (activeTab === 'project' && template.id !== 'project') matchesTab = false;
        if (activeTab === 'team' && template.id !== 'team') matchesTab = false;
        if (activeTab === 'study' && template.id !== 'study') matchesTab = false;
        if (activeTab === 'business' && template.id !== 'freelancer') matchesTab = false; // Map business to freelancer
      }

      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const handleUseTemplate = async (template: WorkspaceTemplate) => {
    if (!activeWorkspace) {
      alert('الرجاء اختيار مساحة عمل أولاً');
      return;
    }

    if (template.pages.length === 0) {
      // Empty template, maybe just create an empty document
      await createPage({
        workspaceId: activeWorkspace.id,
        title: 'صفحة جديدة',
        icon: '📄',
        parentId: null,
      });
      showToast(`تم إنشاء صفحة فارغة بنجاح`);
      router.push(`/${activeWorkspace.slug}`);
      return;
    }

    let count = 0;
    for (const page of template.pages) {
      await createPage({
        workspaceId: activeWorkspace.id,
        title: page.title,
        icon: page.icon,
        parentId: null,
        // The store currently creates default DOCUMENT type, but template has type and isDatabase.
        // We'll rely on the existing createPage dto which might just take title and icon for now,
        // or we pass additional fields if the backend supports it.
      });
      count++;
    }

    showToast(`تم إنشاء ${count} صفحة من قالب ${template.name}`);
    
    // Redirect back to workspace home after short delay
    setTimeout(() => {
      router.push(`/${activeWorkspace.slug}`);
    }, 1500);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-8 dir-rtl">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-cairo text-white">معرض القوالب 📚</h1>
          <p className="text-slate-400">اختر من القوالب الجاهزة للبدء في مساحة عملك بسرعة.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === cat.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قالب..."
              className="pr-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl mb-4 border border-slate-700">
                  {template.icon}
                </div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {template.pages.length} صفحات مضمنة
                </div>
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-slate-800 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
                >
                  استخدم القالب
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-800 border border-emerald-500/50 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

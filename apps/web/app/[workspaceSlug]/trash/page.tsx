'use client';

import React, { use, useState } from 'react';
import { usePageStore } from '@/stores/use-page-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, RotateCcw, Search, FileText } from 'lucide-react';

export default function TrashPage({ params }: { params: Promise<{ workspaceSlug: string }> }) {
  const { workspaceSlug } = use(params);
  const { pageTree, updatePage, deletePage } = usePageStore();
  const [searchQuery, setSearchQuery] = useState('');

  const flattenTree = (nodes: any[]): any[] => {
    let result: any[] = [];
    for (const node of nodes || []) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  };
  
  const allPages = flattenTree(pageTree || []);
  const archivedPages = allPages.filter(p => p.isArchived);
  
  const filteredPages = archivedPages.filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = async (pageId: string) => {
    await updatePage(pageId, { isArchived: false });
  };

  const handlePermanentDelete = async (pageId: string) => {
    // We assume workspaceId is available on the page or we just pass workspaceSlug 
    // Wait, deletePage expects pageId, workspaceId.
    // If the page has workspaceId, we use it, otherwise workspaceSlug as fallback.
    const page = allPages.find(p => p.id === pageId);
    await deletePage(pageId, page?.workspaceId || workspaceSlug);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white font-cairo flex items-center gap-3">
              سلة المحذوفات 🗑️
            </h1>
            <p className="text-slate-400 mt-2">إدارة الصفحات المحذوفة واستعادتها</p>
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="البحث في المحذوفات..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700 focus:border-emerald-500 pl-4 pr-10 min-w-[250px]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => (
              <Card key={page.id} className="bg-slate-900/50 border-white/10 backdrop-blur hover:bg-slate-800/50 transition-all">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
                      {page.icon || <FileText className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-lg">{page.title || 'صفحة بدون عنوان'}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>تاريخ الحذف: {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString('ar-EG') : 'غير معروف'}</span>
                        {page.author && <span>• الكاتب: {page.author}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={() => handleRestore(page.id)}
                      className="flex-1 sm:flex-none bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-600/30 gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      استعادة
                    </Button>
                    <Button 
                      onClick={() => handlePermanentDelete(page.id)}
                      variant="destructive"
                      className="flex-1 sm:flex-none bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-500/20 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف نهائي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/30 rounded-2xl border border-white/5 backdrop-blur">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 font-cairo mb-2">سلة المحذوفات فارغة</h3>
              <p className="text-slate-500 max-w-sm">لا توجد أي صفحات محذوفة حالياً. يمكنك حذف الصفحات وستظهر هنا لتتمكن من استعادتها أو حذفها نهائياً.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

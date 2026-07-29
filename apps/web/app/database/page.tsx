'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDatabaseStore } from '@/stores/use-database-store';
import { PropertyTypeSelector, PROPERTY_TYPE_CONFIG } from '@/components/database/property-type-selector';
import { TableView } from '@/components/database/table-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PagePropertyType } from '@masar/types';
import { Sparkles, ArrowLeft, Plus, Trash2, Columns, Table, LayoutTemplate, CalendarDays } from 'lucide-react';
import { KanbanBoard } from '@/components/database/kanban/kanban-board';
import { CalendarView } from '@/components/database/calendar/calendar-view';

export default function DatabasePage() {
  const [pageId] = useState('db-demo-page-001');
  const { properties, fetchDatabaseSchema, createProperty, deleteProperty, createRow } = useDatabaseStore();

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<PagePropertyType>(PagePropertyType.TEXT);
  const [formulaExpression, setFormulaExpression] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedFormUrl, setCopiedFormUrl] = useState(false);
  
  const [currentView, setCurrentView] = useState<'table' | 'kanban' | 'calendar'>('table');

  useEffect(() => {
    fetchDatabaseSchema(pageId);
  }, [fetchDatabaseSchema, pageId]);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim()) return;

    setIsSubmitting(true);
    const success = await createProperty({
      name: propertyName,
      type: propertyType,
      pageId,
      options: propertyType === PagePropertyType.FORMULA ? { expression: formulaExpression } : undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setPropertyName('');
      setFormulaExpression('');
      setShowAddPropertyModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 right-20 w-[30rem] h-[30rem] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 4 - Module 08: Table View & Virtualized Grid</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white font-cairo">
              عرض الجداول والتمرير الافتراضي
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              جدول بيانات فائق الأداء (Virtualized) يدعم تعديل الخلايا المباشر (Inline Editing) وتغيير حجم الأعمدة
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setShowAddPropertyModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>إضافة عمود</span>
            </Button>

            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>الرئيسية</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Properties Summary Grid (Optional, keep for schema management context) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-cairo text-white flex items-center gap-2">
              <Columns className="w-4 h-4 text-emerald-400" />
              <span>مخطط الأعمدة ({properties.length})</span>
            </h3>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                onClick={() => {
                  const url = `${window.location.origin}/forms/${pageId}`;
                  navigator.clipboard.writeText(url);
                  setCopiedFormUrl(true);
                  setTimeout(() => setCopiedFormUrl(false), 2000);
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{copiedFormUrl ? 'تم النسخ!' : 'نشر كنموذج (Form)'}</span>
              </Button>
              <Button variant="secondary" size="sm" onClick={() => createRow(pageId)} className="gap-2">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>إضافة صف (Row)</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {properties.map((prop) => {
              const config = PROPERTY_TYPE_CONFIG[prop.type as PagePropertyType] || PROPERTY_TYPE_CONFIG[PagePropertyType.TEXT];
              const Icon = config.icon;
              return (
                 <Badge key={prop.id} variant="outline" className="flex items-center gap-2 py-1.5 px-3 bg-slate-900/50 border-slate-700">
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    <span className="text-xs font-cairo">{prop.name}</span>
                    <button onClick={() => deleteProperty(prop.id, pageId)} className="ml-2 text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                 </Badge>
              )
            })}
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex p-1 bg-slate-900/60 border border-slate-800 rounded-lg w-fit">
          <button
            onClick={() => setCurrentView('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              currentView === 'table' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Table className="w-4 h-4" />
            جدول البيانات
          </button>
          <button
            onClick={() => setCurrentView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              currentView === 'kanban' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            لوحة الكانبان
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              currentView === 'calendar' ? 'bg-amber-500/20 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            التقويم (ميلادي/هجري)
          </button>
        </div>

        {/* Virtualized Table View */}
        {/* View Content */}
        <Card className="mt-4 border-slate-800/80 bg-slate-900/40 shadow-2xl">
          <CardHeader className="pb-4 border-b border-slate-800/50">
            <CardTitle className="flex items-center gap-2 text-base">
              {currentView === 'table' && (
                <>
                  <Table className="w-4 h-4 text-emerald-400" />
                  <span>عرض الجدول (Table View)</span>
                </>
              )}
              {currentView === 'kanban' && (
                <>
                  <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                  <span>لوحة الكانبان (Kanban Board)</span>
                </>
              )}
              {currentView === 'calendar' && (
                <>
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                  <span>التقويم (Calendar)</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {currentView === 'table' && 'انقر على أي خلية للتعديل المباشر. يمكنك السحب لتغيير حجم الأعمدة.'}
              {currentView === 'kanban' && 'اسحب وأفلت البطاقات بين الأعمدة لتحديث حالة البيانات مباشرة.'}
              {currentView === 'calendar' && 'عرض المهام وتواريخ الاستحقاق حسب التقويم الميلادي والهجري (أم القرى).'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             {currentView === 'table' && <TableView pageId={pageId} />}
             {currentView === 'kanban' && <KanbanBoard pageId={pageId} />}
             {currentView === 'calendar' && <CalendarView pageId={pageId} />}
          </CardContent>
        </Card>

        {/* Modal Add Property */}
        {showAddPropertyModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full p-6 rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl space-y-6 animate-in zoom-in-95">
              <div className="text-right">
                <h3 className="text-lg font-bold font-cairo text-white">إضافة عمود جديد للجدول</h3>
                <p className="text-xs text-slate-400">حدد اسم العمود ونوع البيانات التي سيحتويها</p>
              </div>

              <form onSubmit={handleCreateProperty} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">اسم العمود</label>
                  <Input
                    required
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="مثال: المهام، التاريخ، السعر..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">نوع البيانات</label>
                  <PropertyTypeSelector value={propertyType} onChange={(t) => setPropertyType(t)} />
                </div>

                {propertyType === PagePropertyType.FORMULA && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">المعادلة (Expression)</label>
                    <Input
                      required
                      value={formulaExpression}
                      onChange={(e) => setFormulaExpression(e.target.value)}
                      placeholder="مثال: السعر * الكمية"
                      className="font-mono text-indigo-400 bg-indigo-950/20 border-indigo-500/30 focus-visible:ring-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      استخدم الأسماء الحقيقية للأعمدة (مثال: Price * Qty). تدعم العمليات الحسابية الأساسية.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowAddPropertyModal(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة العمود'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

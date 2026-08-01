'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileJson, FileText, AlertTriangle, CheckCircle, Database } from 'lucide-react';

interface ExportImportProps {
  workspaceSlug: string;
}

export function ExportImport({ workspaceSlug }: ExportImportProps) {
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export generation
    setTimeout(() => {
      setIsExporting(false);
      
      // Dummy download creation
      const dummyData = { workspace: workspaceSlug, timestamp: new Date().toISOString(), pages: [] };
      const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `masar-export-${workspaceSlug}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!importFile) return;
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      setImportFile(null);
      alert('تم استيراد البيانات بنجاح!');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Export Section */}
      <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-cairo">
            <Download className="w-5 h-5 text-indigo-400" /> تصدير البيانات
          </CardTitle>
          <CardDescription>الاحتفاظ بنسخة احتياطية من مساحة العمل الخاصة بك.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            <p className="text-sm text-slate-300">اختر تنسيق التصدير:</p>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  exportFormat === 'json' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <FileJson className="w-6 h-6" />
                <span className="text-xs font-medium">JSON</span>
              </button>
              
              <button
                onClick={() => setExportFormat('markdown')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  exportFormat === 'markdown' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs font-medium">Markdown</span>
              </button>

              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  exportFormat === 'csv' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <Database className="w-6 h-6" />
                <span className="text-xs font-medium text-center">CSV<br/>(لقواعد البيانات)</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 mt-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
              سيتم تصدير جميع الصفحات، وقواعد البيانات، والمجلدات الخاصة بمساحة العمل الحالية في ملف مضغوط أو حسب التنسيق المختار.
            </div>
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isExporting} 
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            {isExporting ? 'جاري التصدير...' : 'تصدير كل الصفحات'}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-cairo">
            <Upload className="w-5 h-5 text-emerald-400" /> استيراد بيانات
          </CardTitle>
          <CardDescription>استعادة بيانات أو نقلها من أداة أخرى أو نسخة سابقة.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Warning Message */}
            <div className="flex items-start gap-2 text-xs text-amber-200 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <p>تنبيه: سيتم دمج البيانات المستوردة مع المحتوى الحالي لمساحة العمل. لن يتم حذف البيانات الحالية.</p>
            </div>

            {/* Drop Zone */}
            <div className="flex-1 min-h-[120px] relative">
              <input 
                type="file" 
                accept=".json,.csv,.zip" 
                onChange={handleImportFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`absolute inset-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors p-4 text-center ${
                importFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-slate-950/30 hover:border-slate-500 hover:bg-slate-800/40'
              }`}>
                {importFile ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-sm font-medium text-emerald-300">{importFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1">{(importFile.size / 1024).toFixed(1)} KB</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-sm font-medium text-slate-300">اسحب الملف هنا أو انقر للاستعراض</span>
                    <span className="text-xs text-slate-500 mt-1">يدعم JSON, CSV أو ملفات ZIP المصدرة مسبقاً</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleImport} 
            disabled={!importFile || isImporting} 
            variant={importFile ? 'default' : 'outline'}
            className={`w-full mt-6 font-bold ${
              importFile 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-0' 
                : 'border-slate-700 text-slate-500 bg-slate-800/30'
            }`}
          >
            {isImporting ? 'جاري الاستيراد...' : 'استيراد'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

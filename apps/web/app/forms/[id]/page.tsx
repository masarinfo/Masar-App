'use client';

import React, { useEffect, useState, use } from 'react';
import { PagePropertyType, IProperty } from '@masar/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Database, CheckCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch(`${API_URL}/public/forms/${resolvedParams.id}/schema`);
        if (!res.ok) {
          throw new Error('هذا النموذج غير متاح للعامة أو تم حذفه.');
        }
        const data = await res.json();
        
        // Filter out properties that users shouldn't manually fill (e.g., formulas, rollups)
        const formFields = data.properties.filter(
          (p: IProperty) => p.type !== PagePropertyType.FORMULA && p.type !== PagePropertyType.ROLLUP
        );
        
        setProperties(formFields);
        setTitle(data.title);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchema();
  }, [resolvedParams.id]);

  const handleChange = (propId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [propId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_URL}/public/forms/${resolvedParams.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('فشل إرسال البيانات. يرجى المحاولة مرة أخرى.');
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (prop: IProperty) => {
    const val = formData[prop.id] || '';

    switch (prop.type) {
      case PagePropertyType.NUMBER:
        return (
          <Input
            type="number"
            required
            value={val}
            onChange={(e) => handleChange(prop.id, e.target.value)}
            className="bg-slate-900 border-slate-700"
            placeholder={`أدخل ${prop.name}`}
          />
        );
      case PagePropertyType.DATE:
        return (
          <Input
            type="date"
            required
            value={val}
            onChange={(e) => handleChange(prop.id, e.target.value)}
            className="bg-slate-900 border-slate-700 text-slate-200"
          />
        );
      case PagePropertyType.CHECKBOX:
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={val === 'true' || val === true}
              onChange={(e) => handleChange(prop.id, e.target.checked)}
              className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-400">نعم / موافق</span>
          </div>
        );
      case PagePropertyType.SELECT:
      case PagePropertyType.MULTI_SELECT:
        // Render simple input as fallback if options aren't fully configured
        // Real implementation would render a <select> based on prop.options
        return (
          <Input
            required
            value={val}
            onChange={(e) => handleChange(prop.id, e.target.value)}
            className="bg-slate-900 border-slate-700"
            placeholder={`أدخل ${prop.name}`}
          />
        );
      default:
        return (
          <Input
            required
            value={val}
            onChange={(e) => handleChange(prop.id, e.target.value)}
            className="bg-slate-900 border-slate-700"
            placeholder={`أدخل ${prop.name}`}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Database className="w-12 h-12 text-slate-700 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-300 font-cairo">النموذج غير متاح</h1>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center animate-in zoom-in-95">
          <CardContent className="pt-10 pb-10 space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-cairo text-white">تم إرسال بياناتك بنجاح!</h2>
            <p className="text-sm text-slate-400">لقد تم تسجيل مشاركتك في قاعدة البيانات.</p>
            <Button
              variant="outline"
              className="mt-6 border-slate-700 hover:bg-slate-800"
              onClick={() => {
                setFormData({});
                setIsSuccess(false);
              }}
            >
              إرسال رد آخر
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 p-4 md:p-12 relative overflow-hidden">
      <div className="max-w-2xl mx-auto z-10 relative mt-10">
        <header className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 text-slate-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نموذج جمع بيانات (Forms Engine)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white font-cairo">
            {title || 'نموذج إدخال بيانات'}
          </h1>
          <p className="text-slate-400">يرجى تعبئة الحقول أدناه لإرسال مشاركتك</p>
        </header>

        <Card className="border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 md:p-8 space-y-6">
              {properties.length === 0 ? (
                <p className="text-center text-slate-500 py-10">لا توجد حقول متوفرة في هذا النموذج.</p>
              ) : (
                properties.map((prop) => (
                  <div key={prop.id} className="space-y-2">
                    <label className="block text-sm font-bold font-cairo text-slate-200">
                      {prop.name} <span className="text-rose-500">*</span>
                    </label>
                    {renderField(prop)}
                  </div>
                ))
              )}
            </CardContent>
            
            {properties.length > 0 && (
              <div className="p-6 md:p-8 pt-0 border-t border-slate-800/50 mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-cairo">مشغل بواسطة Masar SaaS</p>
                <Button type="submit" disabled={isSubmitting} className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8">
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال البيانات'}</span>
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

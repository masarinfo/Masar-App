'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, ArrowLeft, Palette, Type, Layers, CheckCircle, Search, Mail, Shield } from 'lucide-react';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نظام التصميم العربي والدليل البصري (Design System v1.0)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-cairo">
              دليل معايير التصميم والخطوط العربية
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              نظام تصميم مخصص لـ Masar SaaS بدعم كامل للـ RTL، التبديل الزجاجي، ومتغيرات HSL الأنيقة.
            </p>
          </div>

          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </Button>
          </Link>
        </div>

        {/* Section 1: Typography */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-400 font-bold font-cairo text-xl">
            <Type className="w-6 h-6" />
            <h2>الخطوط العربية الهيكلية (Arabic Typography)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Badge variant="cyan">العناوين الرئيسية</Badge>
                <CardTitle className="font-cairo text-2xl pt-2">خط القاهرة (Cairo)</CardTitle>
                <CardDescription>مخصص للعناوين الهيكلية الكبيرة والقوائم الرئيسية (Weight: 700 - 900)</CardDescription>
              </CardHeader>
              <CardContent className="font-cairo space-y-2 text-right">
                <p className="text-2xl font-black text-white">منصة مسار بيئة العمل الفائقة</p>
                <p className="text-lg font-bold text-slate-300">أسرع محرر نصوص تفاعلي عربي</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="default">النصوص الأساسية</Badge>
                <CardTitle className="font-readex text-2xl pt-2">Readex Pro</CardTitle>
                <CardDescription>الخط القياسي لنصوص المحرر والجداول وواجهة المستخدم (Weight: 400 - 600)</CardDescription>
              </CardHeader>
              <CardContent className="font-readex space-y-2 text-right">
                <p className="text-base text-slate-200">تدوين الملاحظات الذكية وإدارة المشاريع بسلاسة فائقة.</p>
                <p className="text-sm text-slate-400">يدعم الاتجاه التلقائي للجمل المشتركة (عربي + إنجليزي + كود).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary">العناوين الفرعية</Badge>
                <CardTitle className="font-tajawal text-2xl pt-2">خط تجول (Tajawal)</CardTitle>
                <CardDescription>مخصص للتوضيحات والعناوين الفرعية والأزرار الثانوية</CardDescription>
              </CardHeader>
              <CardContent className="font-tajawal space-y-2 text-right">
                <p className="text-lg font-bold text-slate-200">أنظمة البيانات والتكامل المحوّلي</p>
                <p className="text-sm text-slate-400">حفظ البيانات فورياً في المتصفح والمزامنة الخلفية.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Component Library Preview */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-400 font-bold font-cairo text-xl">
            <Layers className="w-6 h-6" />
            <h2>مكتبة المكونات المخصصة (RTL Components)</h2>
          </div>

          <Tabs defaultValue="buttons" className="w-full">
            <TabsList>
              <TabsTrigger value="buttons">الأزرار (Buttons)</TabsTrigger>
              <TabsTrigger value="inputs">المُدخلات (Inputs)</TabsTrigger>
              <TabsTrigger value="badges">الأوسمة والرمز (Badges & Avatars)</TabsTrigger>
            </TabsList>

            {/* Tab 1: Buttons */}
            <TabsContent value="buttons">
              <Card>
                <CardHeader>
                  <CardTitle>أنماط الأزرار (Button Variants)</CardTitle>
                  <CardDescription>مجموعة متنوعة من الأزرار المخصصة بحجم واستجابة فائقة</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">
                    <Sparkles className="w-4 h-4" />
                    <span>الزر الأساسي (Default)</span>
                  </Button>

                  <Button variant="glass">
                    <Layers className="w-4 h-4" />
                    <span>الزر الزجاجي (Glass)</span>
                  </Button>

                  <Button variant="secondary">زر ثانوي (Secondary)</Button>

                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                    <span>زر حدودي (Outline)</span>
                  </Button>

                  <Button variant="ghost">زر شفاف (Ghost)</Button>

                  <Button variant="destructive">زر إزالة (Destructive)</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Inputs */}
            <TabsContent value="inputs">
              <Card>
                <CardHeader>
                  <CardTitle>حقول الإدخال والبحث (Inputs)</CardTitle>
                  <CardDescription>حقول إدخال متوافقة مع محاذاة RTL والتركيز الإشعاعي</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">البريد الإلكتروني</label>
                    <div className="relative">
                      <Input placeholder="أدخل بريدك الإلكتروني..." />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">البحث السريع</label>
                    <div className="relative">
                      <Input placeholder="ابحث في المستندات والجداول..." />
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Badges & Avatars */}
            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>الأوسمة والرمز الشخصية (Badges & Avatars)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="default">نشط الآن</Badge>
                    <Badge variant="cyan">مسار SaaS</Badge>
                    <Badge variant="secondary">مسودة</Badge>
                    <Badge variant="destructive">مغلق</Badge>
                    <Badge variant="outline">إصدار v1.0.0</Badge>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                    <Avatar name="محمد العتيبي" size="lg" />
                    <Avatar name="سارة الأحمد" size="md" />
                    <Avatar name="أحمد علي" size="sm" />
                    <div className="text-sm text-slate-400">توليد تلقائي للاختصارات بالحروف العربية عند عدم توفر الصورة</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer Audit */}
        <div className="text-center pt-8 border-t border-slate-800 text-sm text-slate-500 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Module 02: Design System & Arabic Typography مكتمل وجاهز للربط في كافة التطبيقات</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
          <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/30">
            الاشتراكات والفواتير
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-white font-cairo">
            ارتقِ بإنتاجية فريقك
          </h1>
          <p className="text-slate-400">
            اختر الخطة المناسبة لحجم فريقك واحتياجاتك. جميع الخطط تدعم اللغة العربية بالكامل وأدوات الذكاء الاصطناعي.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Free Plan */}
          <Card className="bg-slate-900/50 border-slate-800 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-cairo text-white">الأساسية (Free)</CardTitle>
              <CardDescription>للأفراد والفرق الصغيرة للبدء.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-slate-500"> / شهرياً</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500" /> مساحة عمل واحدة
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500" /> حتى 3 أعضاء
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500" /> مستندات لا محدودة
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500" /> 100 رمز ذكاء اصطناعي (محدود)
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300" disabled>
                الخطة الحالية
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-gradient-to-b from-indigo-900/20 to-slate-900/50 border-indigo-500/30 flex flex-col relative scale-100 md:scale-105 shadow-2xl z-10">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              الأكثر شعبية
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold font-cairo flex items-center gap-2 text-indigo-100">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                المحترفين (Pro)
              </CardTitle>
              <CardDescription>للفرق المتنامية التي تحتاج لأدوات متقدمة.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-black text-white">$12</span>
                <span className="text-slate-500"> / مستخدم / شهرياً</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3 font-bold text-white">
                  <Check className="w-4 h-4 text-indigo-400" /> كل ما في الخطة المجانية، بالإضافة إلى:
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-400" /> عدد غير محدود من الأعضاء
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-400" /> ذكاء اصطناعي غير محدود (Masar AI)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-400" /> محرك النماذج المتقدمة (Forms Engine)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-400" /> استرداد المستندات حتى 30 يوماً
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2">
                <Zap className="w-4 h-4" /> ترقية إلى Pro
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-slate-900/50 border-slate-800 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-cairo flex items-center gap-2 text-slate-100">
                <Building2 className="w-5 h-5 text-slate-400" />
                المؤسسات (Enterprise)
              </CardTitle>
              <CardDescription>أمان متقدم وتحكم كامل في بيانات مؤسستك.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-black text-white">مخصص</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500" /> تسجيل الدخول الموحد (SSO & SAML)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500" /> مدير حساب مخصص (Account Manager)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500" /> تقارير متقدمة وسجلات الأمان (Audit Logs)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-slate-500" /> استضافة خاصة (Dedicated Cloud)
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white">
                تواصل مع المبيعات
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Support Section */}
        <div className="text-center pt-8 border-t border-slate-800/50">
          <p className="text-slate-400 mb-4">هل لديك استفسارات حول الخطط أو تحتاج لباقات مخصصة؟</p>
          <Link href="/">
            <Button variant="link" className="text-emerald-400 hover:text-emerald-300">
              العودة للرئيسية
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

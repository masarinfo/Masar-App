'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "هل يمكنني الترقية أو الإلغاء في أي وقت؟",
    answer: "نعم، يمكنك الترقية أو الإلغاء في أي وقت. عند الترقية سيتم احتساب الفرق بشكل تناسبي. وعند الإلغاء ستستمر في التمتع بميزات الخطة المدفوعة حتى نهاية دورة الفاتورة الحالية."
  },
  {
    question: "كيف يتم احتساب عدد المستخدمين؟",
    answer: "يتم احتساب المستخدمين بناءً على عدد الأعضاء النشطين في مساحة العمل. الضيوف لا يتم احتسابهم ضمن عدد المستخدمين."
  },
  {
    question: "هل يتوفر خصم للمؤسسات التعليمية أو غير الربحية؟",
    answer: "نعم، نقدم خصماً بنسبة 50٪ للمؤسسات التعليمية المعتمدة والمنظمات غير الربحية. يرجى التواصل مع فريق الدعم لتفعيل الخصم."
  },
  {
    question: "كيف تعمل طلبات الذكاء الاصطناعي (AI)؟",
    answer: "الخطة الاحترافية تمنحك 500 طلب/شهر للاستخدام عبر جميع ميزات الذكاء الاصطناعي. أما خطة الأعمال فتوفر استخداماً غير محدود للذكاء الاصطناعي."
  }
];

export default function WorkspaceBillingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
          <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 font-cairo px-3 py-1">
            الاشتراكات والفواتير
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-white font-cairo leading-tight">
            اختر الخطة المناسبة لفريقك
          </h1>
          <p className="text-slate-400 text-lg">
            خطط مرنة تنمو مع أعمالك. اختر الباقة التي تلبي احتياجاتك.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm font-bold", !isAnnual ? "text-white" : "text-slate-400")}>شهري</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <div className={cn(
                "absolute top-1 left-1 bg-emerald-500 w-5 h-5 rounded-full transition-transform",
                isAnnual ? "translate-x-7" : "translate-x-0"
              )} />
            </button>
            <span className={cn("text-sm font-bold flex items-center gap-2", isAnnual ? "text-white" : "text-slate-400")}>
              سنوي
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                وفر 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Free Plan */}
          <Card className="bg-slate-900/40 border-slate-800 flex flex-col backdrop-blur-xl">
            <CardHeader className="text-center pb-8 border-b border-slate-800/50">
              <CardTitle className="text-2xl font-bold font-cairo text-white">مجاني</CardTitle>
              <div className="mt-4 flex justify-center items-baseline gap-1">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-slate-500">/ شهر</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-8">
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 5 مساحات عمل</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 100 صفحة</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 3 أعضاء</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 5MB رفع ملفات</li>
                <li className="flex items-center gap-3 text-slate-500"><X className="w-5 h-5 shrink-0" /> بدون مساعدة AI</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-slate-700 bg-slate-800/50 text-slate-400" disabled>
                الخطة الحالية
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-slate-900/60 border-transparent flex flex-col relative scale-100 md:scale-105 shadow-2xl z-10 backdrop-blur-xl">
            {/* Gradient Border Trick */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-500 rounded-2xl -z-10 p-[2px]">
              <div className="absolute inset-0 bg-slate-900/95 rounded-2xl backdrop-blur-xl" />
            </div>
            
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-20">
              <Sparkles className="w-3 h-3" /> الأكثر شعبية
            </div>
            
            <CardHeader className="text-center pb-8 border-b border-slate-800/50 relative z-20">
              <CardTitle className="text-2xl font-bold font-cairo text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">احترافي</CardTitle>
              <div className="mt-4 flex justify-center items-baseline gap-1">
                <span className="text-5xl font-black text-white">{isAnnual ? '$6.4' : '$8'}</span>
                <span className="text-slate-500">/ شهر</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-8 relative z-20">
              <ul className="space-y-4 text-sm text-slate-200">
                <li className="flex items-center gap-3 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> مساحات عمل غير محدودة</li>
                <li className="flex items-center gap-3 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> صفحات غير محدودة</li>
                <li className="flex items-center gap-3 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> 10 أعضاء</li>
                <li className="flex items-center gap-3 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> 100MB رفع ملفات</li>
                <li className="flex items-center gap-3 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> AI مساعد (500 طلب/شهر)</li>
                <li className="flex items-center gap-3 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> سجل مراجعات 30 يوم</li>
              </ul>
            </CardContent>
            <CardFooter className="relative z-20">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold border-0">
                ترقية الآن
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-slate-900/40 border-slate-800 flex flex-col backdrop-blur-xl">
            <CardHeader className="text-center pb-8 border-b border-slate-800/50">
              <CardTitle className="text-2xl font-bold font-cairo flex justify-center items-center gap-2 text-indigo-400">
                أعمال
              </CardTitle>
              <div className="mt-4 flex justify-center items-baseline gap-1">
                <span className="text-5xl font-black text-white">{isAnnual ? '$12' : '$15'}</span>
                <span className="text-slate-500">/ شهر</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-8">
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3 font-medium text-white"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> كل ميزات الاحترافي بالإضافة إلى:</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> أعضاء غير محدودين</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> رفع غير محدود</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> AI غير محدود</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> سجل مراجعات غير محدود</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> دعم أولوية</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0" /> SSO تسجيل موحد</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400">
                تواصل معنا
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-16 pb-8">
          <h2 className="text-2xl font-bold font-cairo text-white text-center mb-8">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm transition-all"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-right focus:outline-none"
                >
                  <span className="font-bold font-cairo text-slate-200">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

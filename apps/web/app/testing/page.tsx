'use client';

import React from 'react';
import Link from 'next/link';

export default function TestingPage() {
  const routes = [
    {
      category: 'صفحات عامة ودخول',
      links: [
        { name: 'الصفحة الرئيسية', path: '/' },
        { name: 'تسجيل الدخول', path: '/login' },
        { name: 'تسجيل حساب جديد', path: '/register' },
        { name: 'تهيئة المساحة (Onboarding)', path: '/onboarding' },
      ],
    },
    {
      category: 'مساحة العمل (تحتاج تسجيل دخول)',
      links: [
        { name: 'داشبورد المساحة (استبدل my-workspace)', path: '/my-workspace' },
        { name: 'إعدادات المساحة', path: '/my-workspace/settings' },
        { name: 'الفواتير والاشتراكات', path: '/my-workspace/settings/billing' },
        { name: 'القوالب', path: '/my-workspace/templates' },
        { name: 'سلة المحذوفات', path: '/my-workspace/trash' },
        { name: 'صفحة ذكية (تحتاج استبدال page-id)', path: '/my-workspace/test-page-id' },
      ],
    },
    {
      category: 'صفحات المشاركة الخارجية',
      links: [
        { name: 'صفحة عامة (Public)', path: '/public/test-id' },
        { name: 'نموذج إدخال بيانات (Form)', path: '/forms/test-id' },
      ],
    },
    {
      category: 'أدوات المطورين للتجارب',
      links: [
        { name: 'المحرر التجريبي', path: '/editor' },
        { name: 'نظام التصميم (Design System)', path: '/design-system' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-cairo" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-cyan-400">
            صفحة اختبار الروابط (Testing)
          </h1>
          <p className="text-slate-400">هذه الصفحة مخصصة للمطورين لاختبار التنقل السريع بين جميع المسارات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((group, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl space-y-4">
              <h2 className="text-xl font-bold text-emerald-400 border-b border-white/5 pb-2">
                {group.category}
              </h2>
              <ul className="space-y-3">
                {group.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.path}
                      className="block p-3 rounded-lg bg-slate-800/40 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all text-slate-300 hover:text-emerald-300 group"
                    >
                      <div className="font-semibold">{link.name}</div>
                      <div className="text-xs text-slate-500 group-hover:text-emerald-500/70 mt-1 font-mono text-left" dir="ltr">
                        {link.path}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

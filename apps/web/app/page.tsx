'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { Layers, Sparkles, Database, Code, CheckCircle2, LogIn, UserPlus, LogOut, ShieldCheck, User, Palette, Building2, FileText, FolderTree, Table } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between max-w-6xl mx-auto w-full z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 font-['Cairo']">
            م
          </div>
          <span className="font-extrabold text-xl font-['Cairo'] text-white">مسار</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/database"
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 font-cairo"
          >
            <Table className="w-3.5 h-3.5" />
            <span>قواعد البيانات الحية</span>
          </Link>

          <Link
            href="/workspace/tree"
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 border border-slate-800 bg-slate-900/60 rounded-xl transition-all flex items-center gap-2"
          >
            <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
            <span>شجرة المستندات</span>
          </Link>

          <Link
            href="/editor"
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 border border-slate-800 bg-slate-900/60 rounded-xl transition-all flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>المحرر التكتلي</span>
          </Link>

          <Link
            href="/workspace"
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 border border-slate-800 bg-slate-900/60 rounded-xl transition-all flex items-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>مساحة العمل</span>
          </Link>

          <Link
            href="/design-system"
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 border border-slate-800 bg-slate-900/60 rounded-xl transition-all flex items-center gap-2"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>دليل التصميم</span>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-slate-950 text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>حساب جديد</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-4xl w-full text-center space-y-8 z-10 pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Phase 4: Module 07 (Database Schema Engine & Field Types) مكتمل بنجاح</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-['Cairo']">
          منصة مسار (Masar SaaS)
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          أسرع وأرقى منصة تشاركية عربية لبيئة العمل وتدوين الملاحظات. تم تفعيل محرك قواعد البيانات وحقول البيانات الـ 13.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8 text-right">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">13 Field Types</h3>
            <p className="text-xs text-slate-400">محرك قواعد البيانات الشبيه بـ Notion لدعم 13 نوع من الخصائص.</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <FolderTree className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Nested Page Tree</h3>
            <p className="text-xs text-slate-400">شجرة مستندات متداخلة غير محدودة العمق مع الشريط الجانبي.</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">TipTap Block Editor</h3>
            <p className="text-xs text-slate-400">محرر تكتلي عربي بدعم الاتجاه التلقائي وقائمة الأوامر /.</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Realtime & Security</h3>
            <p className="text-xs text-slate-400">مزامنة Yjs WebSockets وتشفير كلمات المرور وحماية الصلاحيات.</p>
          </div>
        </div>

        {/* Status Check */}
        <div className="pt-6 flex items-center justify-center gap-3 text-sm text-slate-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>حالة النظام: المديولات 00 إلى 07 مكتملة ومفحوصة بنجاح 100%</span>
        </div>
      </div>
    </main>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Edit3, Database, Users, Calendar, Sparkles, ShieldCheck } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isInitialized } = useAuthStore();
  const { workspaces, fetchWorkspaces, isLoading: isWorkspaceLoading } = useWorkspaceStore();
  const [hasFetched, setHasFetched] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchWorkspaces().then(() => setHasFetched(true));
    }
  }, [isAuthenticated, isInitialized, fetchWorkspaces]);

  React.useEffect(() => {
    if (isInitialized && isAuthenticated && hasFetched && !isWorkspaceLoading) {
      if (workspaces.length > 0) {
        router.push(`/${workspaces[0].slug}`);
      } else {
        router.push('/onboarding');
      }
    }
  }, [isInitialized, isAuthenticated, hasFetched, isWorkspaceLoading, workspaces, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white font-cairo overflow-hidden relative" dir="rtl">
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[30rem] h-[30rem] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header / Navbar */}
      <nav className="relative z-20 flex items-center justify-between max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20">
            م
          </div>
          <span className="font-black text-2xl tracking-tight text-white">مسار</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-slate-300 hover:text-white font-bold px-4 py-2 transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
            حساب جديد
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">مسار</span>
          <br className="hidden md:block" />
          {' '}— منصة الإنتاجية العربية
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          نظّم أفكارك، مهامك، ومشاريعك في مكان واحد. بالعربية أولاً.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href="/register" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105">
            ابدأ مجاناً
          </Link>
          <a href="#features" className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-bold text-lg px-8 py-4 rounded-2xl backdrop-blur-sm transition-all">
            تعرف على المزيد
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-slate-400 text-lg">أدوات قوية مصممة خصيصاً للمستخدم العربي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Edit3 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">محرر كتل ذكي</h3>
            <p className="text-slate-400 leading-relaxed">محرر نصوص عربي غني مع أوامر / سريعة، يدعم كافة التنسيقات والوسائط بسهولة.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">قواعد بيانات مرنة</h3>
            <p className="text-slate-400 leading-relaxed">جدول، كانبان، تقويم في مكان واحد. نظم بياناتك بالطريقة التي تناسبك.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">تعاون لحظي</h3>
            <p className="text-slate-400 leading-relaxed">اعمل مع فريقك في نفس الوقت. شارك الأفكار وتابع التقدم بشكل مباشر.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl hover:bg-slate-800/50 hover:border-teal-500/30 transition-all group">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">تقويم هجري وميلادي</h3>
            <p className="text-slate-400 leading-relaxed">دعم كامل للتقويمين ليتناسب مع احتياجات عملك ومواعيدك المحلية.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl hover:bg-slate-800/50 hover:border-purple-500/30 transition-all group">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">مساعد ذكي بالعربية</h3>
            <p className="text-slate-400 leading-relaxed">ذكاء اصطناعي يفهم السياق العربي، يساعدك في الكتابة والتلخيص والترجمة.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md p-8 rounded-3xl hover:bg-slate-800/50 hover:border-rose-500/30 transition-all group">
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">آمن وموثوق</h3>
            <p className="text-slate-400 leading-relaxed">تشفير كامل للبيانات، نسخ احتياطي تلقائي، وصلاحيات متقدمة للمستخدمين.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/20 backdrop-blur-xl p-12 rounded-[3rem]">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">جاهز لتنظيم عالمك؟</h2>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">انضم إلى آلاف المستخدمين الذين غيروا طريقة عملهم مع مسار.</p>
          <Link href="/register" className="inline-block bg-white hover:bg-slate-100 text-slate-950 font-black text-xl px-10 py-5 rounded-2xl shadow-xl transition-transform transform hover:scale-105">
            ابدأ الآن مجاناً
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/50 backdrop-blur-md py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-lg">
              م
            </div>
            <span className="font-bold text-xl text-white">مسار</span>
          </div>
          
          <div className="text-slate-400 text-sm">
            مسار © 2026 - جميع الحقوق محفوظة
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-emerald-400 transition-colors">الشروط والأحكام</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

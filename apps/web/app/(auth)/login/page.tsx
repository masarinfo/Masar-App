'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { LogIn, Mail, Lock, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { fetchWorkspaces } = useWorkspaceStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login({ email, password });
    if (success) {
      const workspaceStore = useWorkspaceStore.getState();
      await fetchWorkspaces();
      const { workspaces } = useWorkspaceStore.getState();
      if (workspaces.length > 0) {
        router.push(`/${workspaces[0].slug}`);
      } else {
        router.push('/onboarding');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>منصة مسار - الدخول الآمن</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Cairo'] tracking-tight mb-2">
            تسجيل الدخول إلى حسابك
          </h1>
          <p className="text-sm text-slate-400">أدخل بياناتك للمتابعة إلى بيئة العمل التشاركية</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Mail className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-800/60 text-sm text-slate-400">
            ليس لديك حساب بعد؟{' '}
            <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { use } from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { usePageStore } from '@/stores/use-page-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Database, Plus, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceDashboardPage({ params }: { params: Promise<{ workspaceSlug: string }> }) {
  const { workspaceSlug } = use(params);
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { pageTree } = usePageStore();

  const today = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const dbPagesCount = pageTree?.filter((p: any) => p.isDatabase || p.type === 'DATABASE').length || 0;
  const docPagesCount = pageTree?.filter((p: any) => !p.isDatabase && p.type !== 'DATABASE').length || 0;
  const membersCount = activeWorkspace?.members?.length || 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 min-h-screen relative">
      <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-black text-white font-cairo mb-2">مرحباً {user?.name || 'مستخدم'} 👋</h1>
          <p className="text-slate-400 text-sm">{today}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl hover:bg-slate-800/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">عدد الصفحات</CardTitle>
              <FileText className="w-5 h-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{docPagesCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl hover:bg-slate-800/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">قواعد البيانات</CardTitle>
              <Database className="w-5 h-5 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{dbPagesCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl hover:bg-slate-800/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">عدد الأعضاء</CardTitle>
              <Users className="w-5 h-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{membersCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
            <Plus className="w-4 h-4" />
            <span>إنشاء صفحة جديدة</span>
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white">
            <Database className="w-4 h-4" />
            <span>إنشاء قاعدة بيانات</span>
          </Button>
          <Link href={`/${workspaceSlug}/settings`}>
            <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
              <UserPlus className="w-4 h-4" />
              <span>دعوة عضو</span>
            </Button>
          </Link>
        </div>

        {/* Recent Pages */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-cairo flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            آخر الصفحات
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {pageTree?.slice(0, 5).map((page: any) => (
              <Link href={`/${workspaceSlug}/${page.id}`} key={page.id} className="min-w-[200px]">
                <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md hover:bg-slate-800/60 hover:border-slate-700 transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <span className="text-2xl">{page.icon || '📄'}</span>
                    <span className="font-bold text-sm text-slate-200 line-clamp-1">{page.title || 'صفحة بدون عنوان'}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {(!pageTree || pageTree.length === 0) && (
              <div className="text-slate-500 text-sm bg-slate-900/30 p-4 rounded-xl border border-slate-800 w-full text-center">
                لا توجد صفحات حتى الآن
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-cairo flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            النشاط الأخير
          </h2>
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center py-8 text-slate-500 text-sm">
                  لا توجد أنشطة مسجلة حتى الآن.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

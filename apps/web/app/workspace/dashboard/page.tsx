'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Users, FileText, Zap, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('masar_token');
        const res = await fetch(`${API_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white font-cairo">لوحة التحكم (Dashboard)</h1>
            <p className="text-slate-400 mt-1">نظرة عامة على نشاط مساحة العمل واستهلاك الموارد.</p>
          </div>
          <Link href="/workspace/settings/billing">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
              <Zap className="w-4 h-4 text-indigo-300" />
              <span>ترقية خطة الاشتراك</span>
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">إجمالي المستندات</CardTitle>
              <FileText className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">{data?.stats?.totalPages || 0}</div>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12% هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">أعضاء الفريق</CardTitle>
              <Users className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">{data?.stats?.activeMembers || 0}</div>
              <p className="text-xs text-slate-500 mt-1">2 متصلين الآن</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">استهلاك الذكاء الاصطناعي</CardTitle>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-amber-400">{data?.stats?.aiTokensUsed || 0}</div>
              <p className="text-xs text-slate-500 mt-1">رمز (Token) تم استخدامه</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-300 font-cairo">مساحة التخزين</CardTitle>
              <Activity className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">{data?.stats?.storageUsed || '0 MB'}</div>
              <p className="text-xs text-slate-500 mt-1">من أصل 1 GB (الخطة المجانية)</p>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs / Recent Activity */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-cairo flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              أحدث الأنشطة (Audit Logs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentLogs?.map((log: any, index: number) => (
                <div key={log.id || index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <span className="text-xs font-bold text-slate-300">
                      {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'M'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">
                      <span className="font-bold text-white font-cairo mr-1">{log.user?.name || 'مستخدم'}</span>
                      {log.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
                        {log.entity}: {log.entityId}
                      </span>
                      • 
                      {new Date(log.createdAt).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
              ))}
              
              {(!data?.recentLogs || data.recentLogs.length === 0) && (
                <div className="text-center py-10 text-slate-500 text-sm">
                  لا توجد أنشطة مسجلة حتى الآن.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}



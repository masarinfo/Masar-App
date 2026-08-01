'use client';

import React, { use, useState } from 'react';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Trash2, Users, Shield, Building2, Save } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceSettingsPage({ params }: { params: Promise<{ workspaceSlug: string }> }) {
  const { workspaceSlug } = use(params);
  const { activeWorkspace, removeMember } = useWorkspaceStore();
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => setIsSaving(false), 1000);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER': return 'المالك';
      case 'ADMIN': return 'مدير';
      case 'MEMBER': return 'عضو';
      default: return 'زائر';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white font-cairo flex items-center gap-3">
              <Settings className="w-8 h-8 text-emerald-500" />
              إعدادات مساحة العمل
            </h1>
            <p className="text-slate-400 mt-2">إدارة تفاصيل مساحة العمل والأعضاء والصلاحيات</p>
          </div>
          <Link href={`/${workspaceSlug}`}>
            <Button variant="outline" className="border-slate-700 text-slate-300">
              العودة
            </Button>
          </Link>
        </div>

        {/* General Settings */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-cairo flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-indigo-400" />
              المعلومات الأساسية
            </CardTitle>
            <CardDescription className="text-slate-400">تحديث اسم وأيقونة مساحة العمل</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">اسم مساحة العمل</label>
              <div className="flex gap-4">
                <Input 
                  value={workspaceName} 
                  onChange={(e) => setWorkspaceName(e.target.value)} 
                  className="bg-slate-950/50 border-slate-700 focus:border-emerald-500 max-w-md"
                />
                <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                  <Save className="w-4 h-4" /> {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-slate-300">أيقونة المساحة</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-3xl border border-slate-700">
                  {activeWorkspace?.icon || '🏢'}
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300">تغيير الأيقونة</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-cairo flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-cyan-400" />
              إدارة الأعضاء
            </CardTitle>
            <CardDescription className="text-slate-400">الأعضاء الحاليين وصلاحياتهم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeWorkspace?.members?.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      {member.user?.name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{member.user?.name || 'مستخدم'}</p>
                      <p className="text-xs text-slate-500">{member.user?.email || 'email@example.com'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                      <Shield className="w-3 h-3" /> {getRoleLabel(member.role)}
                    </div>
                    {member.role !== 'OWNER' && (
                      <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {(!activeWorkspace?.members || activeWorkspace.members.length === 0) && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  لا يوجد أعضاء مضافين
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-slate-900/50 border-rose-900/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-cairo text-rose-500">منطقة الخطر</CardTitle>
            <CardDescription className="text-slate-400">إجراءات لا يمكن التراجع عنها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl border border-rose-900/50 bg-rose-950/10">
              <div>
                <h4 className="font-bold text-slate-200">حذف مساحة العمل</h4>
                <p className="text-xs text-slate-500 mt-1">سيتم حذف جميع الصفحات والبيانات نهائياً ولن تتمكن من استعادتها.</p>
              </div>
              <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700 gap-2 font-bold">
                <Trash2 className="w-4 h-4" /> حذف المساحة
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { UserRole } from '@masar/types';
import { Users, UserPlus, Shield, Trash2, ArrowLeft, Building2, Sparkles, AlertCircle } from 'lucide-react';

export default function WorkspacePage() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { activeWorkspace, fetchWorkspaces, addMember, removeMember, isLoading, error } = useWorkspaceStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.MEMBER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchWorkspaces();
  }, [checkAuth, fetchWorkspaces]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsSubmitting(true);
    const success = await addMember(inviteEmail, inviteRole);
    setIsSubmitting(false);

    if (success) {
      setInviteEmail('');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return <Badge variant="cyan"><Shield className="w-3 h-3" /> المالك (Owner)</Badge>;
      case UserRole.ADMIN:
        return <Badge variant="default">مدير (Admin)</Badge>;
      case UserRole.MEMBER:
        return <Badge variant="secondary">عضو (Member)</Badge>;
      case UserRole.GUEST:
        return <Badge variant="outline">زائر (Guest)</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 right-1/3 w-[30rem] h-[30rem] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <WorkspaceSwitcher />
            <div>
              <h1 className="text-3xl font-extrabold text-white font-cairo">إدارة مساحة العمل والفرق</h1>
              <p className="text-xs text-slate-400">إدارة الأعضاء والصلاحيات والأدوار (RBAC)</p>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Workspace Info & Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Members List */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>أعضاء الفريق ({activeWorkspace?.members?.length || 0})</span>
                  </CardTitle>
                  <CardDescription>قائمة الأعضاء والأدوار المحددة في هذه المساحة</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {activeWorkspace?.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={member.user?.name || 'مستخدم'} src={member.user?.avatarUrl} size="md" />
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{member.user?.name || 'مستخدم مسار'}</p>
                        <p className="text-xs text-slate-400">{member.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getRoleBadge(member.role as UserRole)}
                      {member.role !== UserRole.OWNER && (
                        <button
                          onClick={() => removeMember(member.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                          title="حذف العضو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Add Member Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <span>دعوة عضو جديد</span>
                </CardTitle>
                <CardDescription>أدخل البريد الإلكتروني لمنح الصلاحية</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">البريد الإلكتروني</label>
                    <Input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">الدور / الصلاحية</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={UserRole.ADMIN}>مدير (Admin)</option>
                      <option value={UserRole.MEMBER}>عضو (Member)</option>
                      <option value={UserRole.GUEST}>زائر (Guest)</option>
                    </select>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'جاري الإضافة...' : 'إرسال الدعوة'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

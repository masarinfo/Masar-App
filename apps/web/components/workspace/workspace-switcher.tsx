'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Plus, Building2, Check, Sparkles } from 'lucide-react';

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, selectWorkspaceBySlug, createWorkspace } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setIsSubmitting(true);
    const created = await createWorkspace({ name: newWorkspaceName });
    setIsSubmitting(false);

    if (created) {
      setNewWorkspaceName('');
      setShowCreateModal(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-64 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 transition-all text-slate-100 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 truncate">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            {activeWorkspace?.icon || '🚀'}
          </div>
          <div className="text-right truncate">
            <p className="text-sm font-bold truncate font-cairo">
              {activeWorkspace?.name || 'اختر مساحة عمل'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">/{activeWorkspace?.slug || 'workspace'}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-14 right-0 w-72 p-2 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 space-y-1 animate-in fade-in-50">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-800/80 mb-1">
            مساحات العمل الخاصة بك
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  selectWorkspaceBySlug(ws.slug);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                  activeWorkspace?.id === ws.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span>{ws.icon || '🚀'}</span>
                  <span className="font-semibold truncate">{ws.name}</span>
                </div>
                {activeWorkspace?.id === ws.id && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors border-t border-slate-800/80 mt-1"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مساحة عمل جديدة</span>
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold font-cairo text-white">إنشاء مساحة عمل جديدة</h3>
                <p className="text-xs text-slate-400">اختر اسماً لمساحتك التشاركية للبدء</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">اسم مساحة العمل</label>
                <Input
                  required
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="مثال: فريق مسار، مشروع التقنية..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء المساحة'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

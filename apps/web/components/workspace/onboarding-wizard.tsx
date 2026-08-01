'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { usePageStore } from '@/stores/use-page-store';
import { WORKSPACE_TEMPLATES, WorkspaceTemplate } from '@/lib/workspace-templates';
import { UserRole } from '@masar/types';

interface OnboardingWizardProps {
  onComplete: (workspaceSlug: string) => void;
  onCancel: () => void;
}

const EMOJI_LIST = ['🚀', '💼', '📚', '🎯', '💡', '🏢', '🎨', '📊', '🔬', '🌟', '📝', '🎮', '🏗️', '🔧', '📱', '🌍', '⚡', '🎵', '🏆', '💎'];

export function OnboardingWizard({ onComplete, onCancel }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1 state
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [slug, setSlug] = useState('');
  
  // Step 2 state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('project');
  
  // Step 3 state
  const [inviteEmail, setInviteEmail] = useState('');
  const [invites, setInvites] = useState<string[]>([]);

  const { createWorkspace, addMember } = useWorkspaceStore();
  const { createPage } = usePageStore();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Auto generate slug (Arabic & English letters/numbers/spaces -> dash)
    setSlug(
      val
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, '')
        .replace(/[\s_]+/g, '-')
    );
  };

  const handleAddInvite = () => {
    if (inviteEmail && inviteEmail.includes('@') && !invites.includes(inviteEmail)) {
      setInvites([...invites, inviteEmail]);
      setInviteEmail('');
    }
  };

  const handleRemoveInvite = (emailToRemove: string) => {
    setInvites(invites.filter((e) => e !== emailToRemove));
  };

  const handleCreateWorkspace = async () => {
    if (!name || !slug) return;
    
    setIsSubmitting(true);
    try {
      // 1. Create Workspace
      const workspace = await createWorkspace({ name, slug, icon });
      if (!workspace) throw new Error('Failed to create workspace');
      
      // 2. Create pages based on template
      const template = WORKSPACE_TEMPLATES.find(t => t.id === selectedTemplateId);
      if (template && template.pages.length > 0) {
        for (const page of template.pages) {
          await createPage({
            title: page.title,
            icon: page.icon,
            workspaceId: workspace.id,
            isDatabase: page.isDatabase,
            type: page.type
          });
        }
      }
      
      // 3. Invite members
      for (const email of invites) {
        // useWorkspaceStore's addMember uses the active workspace which should be set by createWorkspace
        await addMember(email, UserRole.MEMBER); 
      }
      
      onComplete(workspace.slug);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4 dir-rtl font-cairo">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden relative">
        
        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-emerald-500' : s < step ? 'w-4 bg-emerald-500/50' : 'w-4 bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Cancel Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="min-h-[400px] flex flex-col">
          {/* Step 1: Workspace Name & Icon */}
          {step === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold text-white mb-2">إعداد مساحة العمل</h2>
              <p className="text-slate-400 mb-8">اختر اسماً ورمزاً يعبران عن مساحة عملك الجديدة.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    اسم مساحة العمل <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    value={name}
                    onChange={handleNameChange}
                    placeholder="مثال: شركة المسار، فريقي، مشروعي..."
                    className="h-12 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 text-lg"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    الرمز التعبيري
                  </label>
                  <div className="grid grid-cols-10 gap-2 p-4 bg-slate-950/30 rounded-xl border border-white/5">
                    {EMOJI_LIST.map((e) => (
                      <button
                        key={e}
                        onClick={() => setIcon(e)}
                        className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                          icon === e ? 'bg-emerald-500/20 ring-1 ring-emerald-500' : 'hover:bg-white/5'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!name.trim()}
                    className="gap-2"
                  >
                    التالي
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Choose Template */}
          {step === 2 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold text-white mb-2">اختر قالب البداية</h2>
              <p className="text-slate-400 mb-8">سنقوم بتجهيز مساحة العمل بصفحات تناسب احتياجك.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {WORKSPACE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedTemplateId === template.id 
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-950/40 border-white/5 hover:bg-slate-900/60 hover:border-white/10'
                    }`}
                  >
                    <div className="text-3xl mb-3">{template.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-400">{template.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Invite Members */}
          {step === 3 && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold text-white mb-2">دعوة أعضاء (اختياري)</h2>
              <p className="text-slate-400 mb-8">شارك مساحة العمل مع فريقك وابدأ التعاون.</p>
              
              <div className="space-y-6 flex-1">
                <div className="flex gap-2">
                  <Input 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInvite()}
                    placeholder="أدخل البريد الإلكتروني..."
                    className="h-11 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 flex-1"
                    type="email"
                    dir="ltr"
                  />
                  <Button 
                    onClick={handleAddInvite} 
                    variant="secondary"
                    className="h-11 px-6"
                    disabled={!inviteEmail.includes('@')}
                  >
                    إضافة
                  </Button>
                </div>
                
                {invites.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">المدعوين ({invites.length})</h4>
                    <div className="max-h-[150px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {invites.map((email) => (
                        <div key={email} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-white/5">
                          <span className="text-sm text-white" dir="ltr">{email}</span>
                          <button 
                            onClick={() => handleRemoveInvite(email)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">يمكنك دعوة أعضاء لاحقاً</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2" disabled={isSubmitting}>
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </Button>
                <Button 
                  onClick={handleCreateWorkspace} 
                  disabled={isSubmitting}
                  className="gap-2 min-w-[160px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      إنشاء مساحة العمل
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

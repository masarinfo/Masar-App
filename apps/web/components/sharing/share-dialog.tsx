'use client';

import * as React from 'react';
import { X, Globe, Link as LinkIcon, Users, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageStore } from '@/stores/use-page-store';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  pageId: string;
  pageTitle: string;
  isOpen: boolean;
  onClose: () => void;
  workspaceSlug: string;
}

export function ShareDialog({ pageId, pageTitle, isOpen, onClose, workspaceSlug }: ShareDialogProps) {
  const togglePublish = usePageStore((state) => state.togglePublish);
  const activePage = usePageStore((state) => state.activePage);
  const [email, setEmail] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const isPublished = activePage?.isPublished ?? false;
  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/public/${pageId}` : '';
  const internalUrl = typeof window !== 'undefined' ? `${window.location.origin}/${workspaceSlug}/${pageId}` : '';

  const handleCopy = (url: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTogglePublish = async () => {
    setIsPublishing(true);
    await togglePublish(pageId, !isPublished);
    setIsPublishing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm dir-rtl">
      <div className="w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            مشاركة: <span className="text-emerald-400 font-normal truncate max-w-[250px]">{pageTitle}</span>
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-100">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-6">
          {/* Invite Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              دعوة أشخاص
            </h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="أدخل البريد الإلكتروني..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <div className="relative">
                <select className="h-11 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 appearance-none pr-8 pl-4 focus:outline-none focus:border-emerald-500">
                  <option>تعديل</option>
                  <option>تعليق</option>
                  <option>عرض فقط</option>
                  <option>وصول كامل</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
              <Button disabled={!email}>دعوة</Button>
            </div>

            {/* Mock Members */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">أ</div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">أحمد محمد</div>
                    <div className="text-xs text-slate-500">ahmed@example.com</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">مالك</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">ف</div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">فاطمة علي</div>
                    <div className="text-xs text-slate-500">fatima@example.com</div>
                  </div>
                </div>
                <select className="bg-transparent text-xs text-slate-400 hover:text-slate-200 focus:outline-none">
                  <option>تعديل</option>
                  <option>عرض</option>
                  <option className="text-rose-400">إزالة</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Publish Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4" />
                  نشر على الإنترنت
                </h3>
                <p className="text-xs text-slate-500">شارك هذه الصفحة مع أي شخص لديه الرابط</p>
              </div>
              <button 
                onClick={handleTogglePublish}
                disabled={isPublishing}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50",
                  isPublished ? "bg-emerald-500" : "bg-slate-700"
                )}
              >
                <span 
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    isPublished ? "-translate-x-6" : "-translate-x-1"
                  )} 
                />
              </button>
            </div>

            {isPublished && (
              <div className="flex items-center gap-2 p-2 bg-slate-950/50 border border-white/5 rounded-xl">
                <div className="flex-1 truncate text-xs text-slate-400 dir-ltr text-left pl-2">
                  {publicUrl}
                </div>
                <Button variant="secondary" size="sm" onClick={() => handleCopy(publicUrl)} className="shrink-0 h-8">
                  {copied ? <Check className="w-3.5 h-3.5 ml-1" /> : <LinkIcon className="w-3.5 h-3.5 ml-1" />}
                  {copied ? 'تم النسخ' : 'نسخ الرابط العام'}
                </Button>
              </div>
            )}
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Copy Internal Link */}
          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-slate-400">رابط داخلي للفريق</div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(internalUrl)} className="text-slate-300">
              <LinkIcon className="w-4 h-4 ml-2" />
              نسخ الرابط
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { IUserAwareness } from '@masar/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Radio, Users } from 'lucide-react';

interface CollaborationHeaderProps {
  isConnected: boolean;
  activeUsers: IUserAwareness[];
  documentTitle?: string;
  isPublished?: boolean;
  onTogglePublish?: (published: boolean) => void;
  pageId?: string;
}

export function CollaborationHeader({
  isConnected,
  activeUsers,
  documentTitle = 'مستند بدون عنوان',
  isPublished = false,
  onTogglePublish,
  pageId,
}: CollaborationHeaderProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    if (!pageId) return;
    const url = `${window.location.origin}/public/${pageId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Radio className={`w-4 h-4 ${isConnected ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
        </div>
        <div>
          <h2 className="text-base font-bold font-cairo text-white">{documentTitle}</h2>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-400">
              {isConnected ? 'متصل بالمزامنة اللحظية (Yjs WebSocket Sync)' : 'مباشر محلي (Local Mode)'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Users Avatar Stack */}
      <div className="flex items-center gap-3">
        <Badge variant={isConnected ? 'default' : 'secondary'} className="gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{activeUsers.length > 0 ? `${activeUsers.length} متواجدون الآن` : 'وضع فردي'}</span>
        </Badge>

        <div className="flex items-center -space-x-2 space-x-reverse overflow-hidden">
          {activeUsers.map((u, i) => (
            <div
              key={u.id || i}
              style={{ borderColor: u.color || '#10b981' }}
              className="relative border-2 rounded-xl"
              title={u.name}
            >
              <Avatar name={u.name} size="sm" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Share to Web Actions */}
      {pageId && (
        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 md:border-r border-slate-700/50 pt-3 md:pt-0 md:pr-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">مشاركة للعامة:</span>
            <button
              onClick={() => onTogglePublish?.(!isPublished)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isPublished ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isPublished ? '-translate-x-1' : '-translate-x-5'
                }`}
              />
            </button>
          </div>
          
          {isPublished && (
            <button
              onClick={handleCopyLink}
              className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-md text-xs font-bold transition-colors ml-2"
            >
              {copied ? 'تم النسخ!' : 'نسخ الرابط العام'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

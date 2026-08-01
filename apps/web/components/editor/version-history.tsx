'use client';

import * as React from 'react';
import { X, History, RotateCcw, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePageStore } from '@/stores/use-page-store';

interface Version {
  id: string;
  versionNumber: number;
  timestamp: string;
  editorName: string;
  content: string;
}

interface VersionHistoryProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VersionHistory({ pageId, isOpen, onClose }: VersionHistoryProps) {
  const [versions, setVersions] = React.useState<Version[]>([]);
  const activePage = usePageStore((state) => state.activePage);
  
  // Mock loading versions
  React.useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const saved = localStorage.getItem(`masar_versions_${pageId}`);
      if (saved) {
        try {
          setVersions(JSON.parse(saved));
        } catch (e) {}
      } else {
        // Initial mock versions if none exist
        const initialVersions: Version[] = [
          {
            id: 'v2',
            versionNumber: 2,
            timestamp: new Date().toISOString(),
            editorName: 'أنت',
            content: activePage?.content || '',
          },
          {
            id: 'v1',
            versionNumber: 1,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            editorName: 'أحمد محمد',
            content: '',
          }
        ];
        setVersions(initialVersions);
        localStorage.setItem(`masar_versions_${pageId}`, JSON.stringify(initialVersions));
      }
    }
  }, [pageId, isOpen, activePage]);

  const handleRestore = (version: Version) => {
    // In a real implementation, this would call an API or update the store directly with the old content
    // and trigger an editor update. For now we just alert.
    alert(`تم استعادة الإصدار ${version.versionNumber}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 w-[350px] z-50 bg-slate-900/95 backdrop-blur-md border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out dir-rtl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-slate-100 font-semibold">
            <History className="w-5 h-5 text-emerald-400" />
            <span>سجل المراجعات</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <History className="w-10 h-10 opacity-20" />
              <p>لا توجد مراجعات سابقة</p>
            </div>
          ) : (
            versions.map((version, index) => {
              const isCurrent = index === 0;
              const date = new Date(version.timestamp);
              
              return (
                <div 
                  key={version.id} 
                  className={cn(
                    "rounded-xl p-4 border transition-colors",
                    isCurrent 
                      ? "bg-emerald-500/5 border-emerald-500/20" 
                      : "bg-slate-800/40 border-white/5 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-200">
                        الإصدار {version.versionNumber}
                      </span>
                      {isCurrent && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          الحالية
                        </span>
                      )}
                    </div>
                    {!isCurrent && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                        onClick={() => handleRestore(version)}
                      >
                        <RotateCcw className="w-3 h-3 ml-1" />
                        استعادة
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                      <span>{date.toLocaleDateString('ar-EG')} - {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 opacity-70" />
                      <span>{version.editorName}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

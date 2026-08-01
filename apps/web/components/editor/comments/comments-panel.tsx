'use client';

import * as React from 'react';
import { X, MessageSquare, Reply, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  authorName: string;
  avatar: string;
  content: string;
  createdAt: string;
  isResolved: boolean;
  replies: Comment[];
}

interface CommentsPanelProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsPanel({ pageId, isOpen, onClose }: CommentsPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'active' | 'resolved'>('active');
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`masar_comments_${pageId}`);
      if (saved) {
        try {
          setComments(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [pageId]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`masar_comments_${pageId}`, JSON.stringify(newComments));
    }
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      authorName: 'المستخدم الحالي',
      avatar: 'م',
      content: newComment,
      createdAt: new Date().toISOString(),
      isResolved: false,
      replies: [],
    };

    if (replyingTo) {
      const updated = comments.map(c => {
        if (c.id === replyingTo) {
          return { ...c, replies: [...c.replies, comment] };
        }
        return c;
      });
      saveComments(updated);
      setReplyingTo(null);
    } else {
      saveComments([...comments, comment]);
    }
    setNewComment('');
  };

  const resolveComment = (id: string) => {
    const updated = comments.map(c => {
      if (c.id === id) {
        return { ...c, isResolved: true };
      }
      return c;
    });
    saveComments(updated);
  };

  const filteredComments = comments.filter(c => 
    activeTab === 'resolved' ? c.isResolved : !c.isResolved
  );

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
          "fixed top-0 bottom-0 left-0 w-[380px] z-50 bg-slate-900/95 backdrop-blur-md border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out dir-rtl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-slate-100 font-semibold">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>التعليقات</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex p-2 gap-1 border-b border-white/10">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              "flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors",
              activeTab === 'active' ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200"
            )}
          >
            تعليقات الصفحة
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={cn(
              "flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors",
              activeTab === 'resolved' ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200"
            )}
          >
            محلولة
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <MessageSquare className="w-10 h-10 opacity-20" />
              <p>لا توجد تعليقات بعد. كن أول من يعلق! 💬</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div key={comment.id} className="bg-slate-800/40 rounded-xl p-3 border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                      {comment.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{comment.authorName}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  {!comment.isResolved && activeTab === 'active' && (
                    <Button variant="ghost" size="icon" onClick={() => resolveComment(comment.id)} className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10" title="تحديد كمحلول">
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="text-sm text-slate-300 leading-relaxed pr-10">
                  {comment.content.split(' ').map((word, i) => 
                    word.startsWith('@') ? <span key={i} className="text-cyan-400">{word} </span> : <span key={i}>{word} </span>
                  )}
                </div>
                {!comment.isResolved && (
                  <div className="pr-10">
                    <button 
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      رد
                    </button>
                  </div>
                )}
                
                {comment.replies.length > 0 && (
                  <div className="pr-6 space-y-3 border-r-2 border-slate-700/50 mr-4 mt-2">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {reply.avatar}
                          </div>
                          <div className="text-xs font-medium text-slate-300">{reply.authorName}</div>
                        </div>
                        <div className="text-sm text-slate-400 leading-relaxed pr-8">
                          {reply.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-slate-900">
          {replyingTo && (
            <div className="flex items-center justify-between bg-slate-800 rounded-t-xl px-3 py-1.5 text-xs text-slate-400">
              <span>الرد على تعليق...</span>
              <button onClick={() => setReplyingTo(null)} className="hover:text-slate-200">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold mt-1">
              م
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="أضف تعليقاً... استخدم @ لذكر شخص"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none min-h-[44px] max-h-[120px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute left-1 bottom-1 h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                onClick={handleSendComment}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

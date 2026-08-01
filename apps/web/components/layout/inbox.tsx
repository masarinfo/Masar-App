'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, MessageSquare, UserPlus, FileEdit } from 'lucide-react';

interface InboxProps {
  workspaceSlug: string;
}

interface Notification {
  id: string;
  type: 'mention' | 'invite' | 'edit';
  message: string;
  timeAgo: string;
  isRead: boolean;
  avatar: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'edit',
    message: "أحمد عدّل صفحة 'مهام المشروع'",
    timeAgo: 'منذ 5 دقائق',
    isRead: false,
    avatar: 'أ',
  },
  {
    id: '2',
    type: 'mention',
    message: "سارة أضافت تعليقاً على 'خطة الإطلاق'",
    timeAgo: 'منذ ساعة',
    isRead: false,
    avatar: 'س',
  },
  {
    id: '3',
    type: 'invite',
    message: "تم دعوتك إلى مساحة 'فريق التصميم'",
    timeAgo: 'منذ 3 ساعات',
    isRead: true,
    avatar: 'ف',
  },
];

export function Inbox({ workspaceSlug }: InboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => activeTab === 'all' || !n.isRead);

  const getIcon = (type: string) => {
    switch (type) {
      case 'edit': return <FileEdit className="w-3 h-3 text-blue-400" />;
      case 'mention': return <MessageSquare className="w-3 h-3 text-emerald-400" />;
      case 'invite': return <UserPlus className="w-3 h-3 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-950"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-md">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/30">
            <h3 className="font-semibold text-slate-100">الإشعارات</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          
          <div className="flex border-b border-white/5 bg-slate-950/20">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${activeTab === 'all' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-300'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`flex-1 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'unread' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-300'}`}
            >
              غير مقروءة
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">{unreadCount}</span>
              )}
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-1">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 hover:bg-slate-800/50 transition-colors flex gap-3 group relative cursor-pointer ${!notification.isRead ? 'bg-emerald-500/5' : ''}`}
                  onClick={() => toggleRead(notification.id)}
                >
                  {!notification.isRead && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm border border-white/5">
                      {notification.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-sm ${!notification.isRead ? 'text-slate-200 font-medium' : 'text-slate-300'} line-clamp-2 leading-relaxed`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{notification.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2">
                <Bell className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm">لا توجد إشعارات جديدة 🔔</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

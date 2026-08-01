'use client';

import React, { useState, useEffect } from 'react';
import { IProperty } from '@masar/types';
import { Zap, Plus, Trash2, ToggleLeft, ToggleRight, ArrowLeftRight, X } from 'lucide-react';

interface AutomationBuilderProps {
  properties: IProperty[];
  pageId: string;
}

interface Automation {
  id: string;
  enabled: boolean;
  trigger: {
    propertyId: string;
    condition: 'changes' | 'becomes_empty' | 'specific_value';
    value?: string;
  };
  action: {
    type: 'set_field' | 'send_notification';
    targetPropertyId?: string;
    value?: string;
    message?: string;
  };
}

export function AutomationBuilder({ properties, pageId }: AutomationBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(`masar_automations_${pageId}`);
    if (stored) {
      try {
        setAutomations(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse automations');
      }
    }
  }, [pageId]);

  const saveAutomations = (newAutomations: Automation[]) => {
    setAutomations(newAutomations);
    localStorage.setItem(`masar_automations_${pageId}`, JSON.stringify(newAutomations));
  };

  const addAutomation = () => {
    const newAutomation: Automation = {
      id: Date.now().toString(),
      enabled: true,
      trigger: {
        propertyId: properties[0]?.id || '',
        condition: 'changes',
      },
      action: {
        type: 'send_notification',
        message: 'تم تحديث الحقل',
      },
    };
    saveAutomations([...automations, newAutomation]);
  };

  const updateAutomation = (id: string, updates: Partial<Automation>) => {
    const updated = automations.map(a => a.id === id ? { ...a, ...updates } : a);
    saveAutomations(updated);
  };

  const deleteAutomation = (id: string) => {
    const updated = automations.filter(a => a.id !== id);
    saveAutomations(updated);
  };

  const toggleAutomation = (id: string) => {
    const automation = automations.find(a => a.id === id);
    if (automation) {
      updateAutomation(id, { enabled: !automation.enabled });
    }
  };

  if (!isClient) return null;

  return (
    <div className="relative font-cairo">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]"
      >
        <Zap className="w-4 h-4" />
        أتمتة
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-96 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-200">الأتمتة (Automations)</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-[400px] overflow-y-auto space-y-4">
            {automations.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                لا توجد أتمتة حالياً. أضف واحدة جديدة لتسهيل عملك.
              </div>
            ) : (
              automations.map(automation => (
                <div key={automation.id} className={`p-3 rounded-xl border ${automation.enabled ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900/50 border-slate-800 opacity-70'} transition-all`}>
                  <div className="flex justify-between items-center mb-3">
                    <button onClick={() => toggleAutomation(automation.id)} className="text-slate-400 hover:text-emerald-400 transition-colors">
                      {automation.enabled ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button onClick={() => deleteAutomation(automation.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    {/* Trigger */}
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <ArrowLeftRight className="w-3 h-3" />
                        عندما (المحفز)
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <select
                          value={automation.trigger.propertyId}
                          onChange={(e) => updateAutomation(automation.id, { trigger: { ...automation.trigger, propertyId: e.target.value } })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                          <option value="">اختر حقلاً...</option>
                          {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        
                        <select
                          value={automation.trigger.condition}
                          onChange={(e) => updateAutomation(automation.id, { trigger: { ...automation.trigger, condition: e.target.value as any } })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                          <option value="changes">يتغير</option>
                          <option value="becomes_empty">يصبح فارغاً</option>
                          <option value="specific_value">يصبح قيمة محددة</option>
                        </select>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        نفّذ (الإجراء)
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <select
                          value={automation.action.type}
                          onChange={(e) => updateAutomation(automation.id, { action: { ...automation.action, type: e.target.value as any } })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                          <option value="send_notification">أرسل إشعاراً</option>
                          <option value="set_field">عيّن قيمة حقل</option>
                        </select>

                        {automation.action.type === 'send_notification' && (
                          <input
                            type="text"
                            value={automation.action.message || ''}
                            onChange={(e) => updateAutomation(automation.id, { action: { ...automation.action, message: e.target.value } })}
                            placeholder="نص الإشعار..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                          />
                        )}

                        {automation.action.type === 'set_field' && (
                          <>
                            <select
                              value={automation.action.targetPropertyId || ''}
                              onChange={(e) => updateAutomation(automation.id, { action: { ...automation.action, targetPropertyId: e.target.value } })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                            >
                              <option value="">اختر الحقل المستهدف...</option>
                              {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={automation.action.value || ''}
                              onChange={(e) => updateAutomation(automation.id, { action: { ...automation.action, value: e.target.value } })}
                              placeholder="القيمة الجديدة..."
                              className="w-full bg-slate-800 border border-slate-700 rounded-md p-1.5 text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <button
              onClick={addAutomation}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-sm font-bold"
            >
              <Plus className="w-4 h-4" />
              إضافة أتمتة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

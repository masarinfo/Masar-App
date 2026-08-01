'use client';

import React, { useState } from 'react';
import { IProperty, PagePropertyType } from '@masar/types';
import { Filter as FilterIcon, ArrowUpDown, Search, Plus, X } from 'lucide-react';

export interface Filter {
  id: string;
  propertyId: string;
  operator: string;
  value: any;
}

export interface Sort {
  propertyId: string;
  direction: 'asc' | 'desc';
}

interface FilterBarProps {
  properties: IProperty[];
  onFiltersChange: (filters: Filter[]) => void;
  onSortChange: (sorts: Sort[]) => void;
}

const getOperatorsForType = (type: PagePropertyType) => {
  switch (type) {
    case PagePropertyType.TEXT:
      return ['يحتوي', 'لا يحتوي', 'يساوي', 'فارغ', 'غير فارغ'];
    case PagePropertyType.NUMBER:
      return ['=', '>', '<', '>=', '<=', 'فارغ'];
    case PagePropertyType.SELECT:
    case PagePropertyType.MULTI_SELECT:
      return ['هو', 'ليس', 'فارغ'];
    case PagePropertyType.DATE:
      return ['قبل', 'بعد', 'فارغ'];
    case PagePropertyType.CHECKBOX:
      return ['محدد', 'غير محدد'];
    default:
      return ['يساوي', 'فارغ'];
  }
};

export function FilterBar({ properties, onFiltersChange, onSortChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSorts, setShowSorts] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [search, setSearch] = useState('');

  const addFilter = () => {
    if (properties.length === 0) return;
    const newFilter: Filter = {
      id: Math.random().toString(),
      propertyId: properties[0].id,
      operator: getOperatorsForType(properties[0].type)[0],
      value: '',
    };
    const updated = [...filters, newFilter];
    setFilters(updated);
    onFiltersChange(updated);
  };

  const removeFilter = (id: string) => {
    const updated = filters.filter((f) => f.id !== id);
    setFilters(updated);
    onFiltersChange(updated);
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    const updated = filters.map((f) => {
      if (f.id !== id) return f;
      const nf = { ...f, ...updates };
      if (updates.propertyId) {
        const p = properties.find((x) => x.id === updates.propertyId);
        if (p) nf.operator = getOperatorsForType(p.type)[0];
      }
      return nf;
    });
    setFilters(updated);
    onFiltersChange(updated);
  };

  const addSort = () => {
    if (properties.length === 0) return;
    const newSort: Sort = {
      propertyId: properties[0].id,
      direction: 'asc',
    };
    const updated = [...sorts, newSort];
    setSorts(updated);
    onSortChange(updated);
  };

  const removeSort = (index: number) => {
    const updated = [...sorts];
    updated.splice(index, 1);
    setSorts(updated);
    onSortChange(updated);
  };

  const updateSort = (index: number, updates: Partial<Sort>) => {
    const updated = [...sorts];
    updated[index] = { ...updated[index], ...updates };
    setSorts(updated);
    onSortChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 mb-4 w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${showFilters ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
          <FilterIcon className="w-4 h-4" />
          تصفية
          {filters.length > 0 && (
            <span className="bg-indigo-500 text-white text-xs px-1.5 rounded-full">
              {filters.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowSorts(!showSorts)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${showSorts ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
          <ArrowUpDown className="w-4 h-4" />
          ترتيب
          {sorts.length > 0 && (
            <span className="bg-emerald-500 text-white text-xs px-1.5 rounded-full">
              {sorts.length}
            </span>
          )}
        </button>

        <div className="relative mr-auto flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute right-3" />
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900/50 border border-slate-800 rounded-lg pr-9 pl-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 w-64"
          />
        </div>
      </div>

      {showFilters && (
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col gap-3 backdrop-blur-md">
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3">
              <select
                value={filter.propertyId}
                onChange={(e) => updateFilter(filter.id, { propertyId: e.target.value })}
                className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 outline-none"
              >
                {getOperatorsForType(
                  properties.find((p) => p.id === filter.propertyId)?.type || PagePropertyType.TEXT,
                ).map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              {!['فارغ', 'غير فارغ', 'محدد', 'غير محدد'].includes(filter.operator) && (
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  placeholder="القيمة..."
                  className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 outline-none flex-1"
                />
              )}

              <button
                onClick={() => removeFilter(filter.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addFilter}
            className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 mr-auto mt-1"
          >
            <Plus className="w-4 h-4" />
            إضافة فلتر
          </button>
        </div>
      )}

      {showSorts && (
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col gap-3 backdrop-blur-md">
          {sorts.map((sort, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <select
                value={sort.propertyId}
                onChange={(e) => updateSort(idx, { propertyId: e.target.value })}
                className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={sort.direction}
                onChange={(e) => updateSort(idx, { direction: e.target.value as 'asc' | 'desc' })}
                className="bg-slate-800 text-sm text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 outline-none"
              >
                <option value="asc">تصاعدي</option>
                <option value="desc">تنازلي</option>
              </select>

              <button
                onClick={() => removeSort(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addSort}
            className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 mr-auto mt-1"
          >
            <Plus className="w-4 h-4" />
            إضافة ترتيب
          </button>
        </div>
      )}
    </div>
  );
}

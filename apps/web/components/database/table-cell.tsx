'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PagePropertyType, IProperty, IDatabaseRow } from '@masar/types';
import { Input } from '@/components/ui/input';
import { useDatabaseStore } from '@/stores/use-database-store';
import { PROPERTY_TYPE_CONFIG } from './property-type-selector';
import { FormulaEngine } from '@/lib/formula-engine';

interface TableCellProps {
  row: IDatabaseRow;
  property: IProperty;
  pageId: string;
}

export function TableCell({ row, property, pageId }: TableCellProps) {
  const { updateCellData, properties } = useDatabaseStore();

  // If this is a formula property, we compute its value dynamically
  let initialValue = row.data?.[property.id] || '';
  if (property.type === PagePropertyType.FORMULA && property.options?.expression) {
    initialValue = FormulaEngine.evaluate(property.options.expression, row, properties) ?? '';
  }

  const [value, setValue] = useState<any>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (property.type === PagePropertyType.FORMULA && property.options?.expression) {
      setValue(FormulaEngine.evaluate(property.options.expression, row, properties) ?? '');
    } else {
      setValue(row.data?.[property.id] || '');
    }
  }, [row, property.id, property.options?.expression, properties]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = async () => {
    setIsEditing(false);
    if (value !== initialValue) {
      await updateCellData(row.id, pageId, property.id, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  const renderContent = () => {
    switch (property.type) {
      case PagePropertyType.NUMBER:
        return <span className="font-mono text-cyan-400">{value}</span>;
      case PagePropertyType.SELECT:
      case PagePropertyType.MULTI_SELECT:
        // Basic rendering for now, can be enhanced with colorful badges
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px]">
            {value}
          </span>
        );
      case PagePropertyType.DATE:
        return <span className="text-rose-300 text-xs">{value}</span>;
      case PagePropertyType.CHECKBOX:
        return (
          <input
            type="checkbox"
            checked={value === 'true' || value === true}
            onChange={async (e) => {
              const newValue = e.target.checked;
              setValue(newValue);
              await updateCellData(row.id, pageId, property.id, newValue);
            }}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50"
          />
        );
      case PagePropertyType.FORMULA:
        return (
          <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded text-[11px]">
            Σ = {value}
          </span>
        );
      default:
        return <span className="text-slate-300 truncate">{value}</span>;
    }
  };

  if (
    isEditing &&
    property.type !== PagePropertyType.CHECKBOX &&
    property.type !== PagePropertyType.FORMULA
  ) {
    return (
      <Input
        ref={inputRef}
        type={property.type === PagePropertyType.NUMBER ? 'number' : 'text'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-7 min-h-0 py-0 px-2 text-xs bg-slate-950 border-emerald-500/50 text-white rounded-md w-full focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
      />
    );
  }

  return (
    <div
      className={`w-full h-full min-h-[32px] flex items-center px-3 py-1 transition-colors rounded-md overflow-hidden ${
        property.type === PagePropertyType.FORMULA
          ? 'cursor-default bg-slate-900/40'
          : 'cursor-text hover:bg-slate-800/30'
      }`}
      onClick={() => {
        if (
          property.type !== PagePropertyType.CHECKBOX &&
          property.type !== PagePropertyType.FORMULA
        ) {
          setIsEditing(true);
        }
      }}
    >
      {value === '' || value === undefined || value === null ? (
        <span className="text-slate-600 italic text-[11px] opacity-0 hover:opacity-100">
          فارغ...
        </span>
      ) : (
        renderContent()
      )}
    </div>
  );
}

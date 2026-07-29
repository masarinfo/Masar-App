import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, name, size = 'md', className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const getInitials = (n?: string) => {
    if (!n) return 'م';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return n.slice(0, 2);
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 font-bold text-emerald-400 items-center justify-center select-none shadow-md',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

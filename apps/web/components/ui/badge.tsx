import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        secondary: 'border-slate-700 bg-slate-800 text-slate-300',
        destructive: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
        outline: 'border-slate-700 text-slate-300',
        cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

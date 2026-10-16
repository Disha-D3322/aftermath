import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 focus:ring-emerald-500',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 focus:ring-red-500',
    outline: 'border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white bg-transparent focus:ring-slate-400',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 focus:ring-slate-500',
    accent: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:brightness-110 focus:ring-teal-400',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { accent?: boolean }> = ({
  className,
  accent,
  children,
  ...props
}) => (
  <div
    className={cn(
      'rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 text-slate-200 shadow-xl transition-all',
      accent && 'border-emerald-500/30 bg-emerald-950/10 shadow-emerald-950/20',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const UrgencyBadge: React.FC<{ urgency: string; className?: string }> = ({ urgency, className }) => {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    moderate: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    unknown: 'bg-slate-600/20 text-slate-400 border-slate-500/40',
  };

  const labels: Record<string, string> = {
    critical: 'CRITICAL PRIORITY',
    high: 'HIGH URGENCY',
    moderate: 'MODERATE',
    low: 'LOW PRIORITY',
    unknown: 'UNKNOWN URGENCY',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border',
        styles[urgency] || styles.unknown,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {labels[urgency] || urgency}
    </span>
  );
};

export const StatusPill: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const styles: Record<string, string> = {
    received: 'bg-slate-700/50 text-slate-300 border-slate-600',
    processing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    needs_review: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    verified: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    assigned: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    in_progress: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    submitted_for_verification: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    completed: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50',
    delivered: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50',
    dispatched: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    pledged: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    approved: 'bg-green-500/20 text-green-300 border-green-500/30',
    resolved: 'bg-slate-700 text-slate-300 border-slate-600',
    rejected: 'bg-red-900/30 text-red-400 border-red-700/50',
    merged: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider border',
        styles[status] || 'bg-slate-800 text-slate-400 border-slate-700',
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

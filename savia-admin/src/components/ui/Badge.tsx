type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  primary: 'bg-primary/15 text-primary',
  default: 'bg-border/40 text-text-secondary',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

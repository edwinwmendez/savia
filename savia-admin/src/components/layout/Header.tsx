interface HeaderProps {
  breadcrumb: string;
  title: string;
  actionButton?: React.ReactNode;
}

export function Header({ breadcrumb, title, actionButton }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-[72px] px-8 bg-surface shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">{breadcrumb}</span>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
      </div>
      {actionButton && <div>{actionButton}</div>}
    </header>
  );
}

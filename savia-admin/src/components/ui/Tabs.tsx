'use client';

export interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.key
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-primary/15 text-primary'
                    : 'bg-border/40 text-text-secondary'
                }`}
              >
                {tab.count}
              </span>
            )}
          </span>
          {activeTab === tab.key && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}

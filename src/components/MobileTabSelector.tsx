import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface MobileTabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  completedTabs: string[];
}

export const MobileTabSelector: React.FC<MobileTabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  completedTabs
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentTab = tabs.find(tab => tab.id === activeTab);
  const completedCount = completedTabs.length;

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mt-6">
      {/* Progress indicator */}
      <div className="text-sm text-muted-foreground mb-2">
        Step Progress: {completedCount} of {tabs.length} sections completed
      </div>
      
      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg text-left hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
            completedTabs.includes(activeTab) 
              ? "bg-green-100 text-green-700" 
              : "bg-muted text-muted-foreground"
          )}>
            {completedTabs.includes(activeTab) ? <Check className="w-4 h-4" /> : "○"}
          </div>
          <span className="font-medium text-foreground">{currentTab?.label}</span>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {tabs.map((tab) => {
              const isCompleted = completedTabs.includes(tab.id);
              const isCurrent = tab.id === activeTab;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors",
                    isCurrent && "bg-accent"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                    isCompleted 
                      ? "bg-green-100 text-green-700" 
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isCurrent ? (
                      "●"
                    ) : (
                      "○"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {tab.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isCompleted ? "Completed" : isCurrent ? "Current" : "Not started"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
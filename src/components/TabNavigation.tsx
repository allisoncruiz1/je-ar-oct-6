import React from 'react';

interface Tab {
  id: string;
  label: string;
  isActive?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="relative flex items-center gap-8 text-base text-[#858791] font-normal text-center mt-6 max-md:max-w-full">
      <div className="border absolute z-0 min-w-60 w-[1060px] shrink-0 h-0 right-[-301px] bg-[#CECFD3] border-[rgba(206,207,211,1)] border-solid bottom-0 max-md:max-w-full" />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`justify-center items-center self-stretch z-0 flex min-h-11 flex-col my-auto ${
            tab.id === activeTab
              ? 'text-[#1B489B] font-semibold border-b-2 border-b-[#1B489B] border-solid'
              : 'text-[#858791] hover:text-[#1B489B] transition-colors'
          }`}
          aria-pressed={tab.id === activeTab}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

import React, { useState } from 'react';
import { TabNavigation } from './TabNavigation';
import { MobileTabSelector } from './MobileTabSelector';
import { AddressForm } from './AddressForm';

interface MainContentProps {
  onFormSubmit?: (data: any) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onFormSubmit }) => {
  const [activeTab, setActiveTab] = useState('mailing-address');
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const tabs = [
    { id: 'mailing-address', label: 'Mailing Address' },
    { id: 'license-business', label: 'License Business info' },
    { id: 'license-details', label: 'License Details' },
    { id: 'business-disclosure', label: 'Business Disclosure' },
    { id: 'team-function', label: 'Team Function' }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    
    // Mark current tab as completed
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs(prev => [...prev, activeTab]);
    }
    
    onFormSubmit?.(data);
  };

  const handleContinue = () => {
    console.log('Continue clicked');
    
    // Mark current tab as completed
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs(prev => [...prev, activeTab]);
    }
    
    // Navigate to next tab or step
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  return (
    <main className="items-stretch shadow-[2px_4px_6px_0_rgba(12,15,36,0.08)] flex min-w-60 flex-col flex-1 bg-white p-4 rounded-lg max-md:p-3 max-md:mx-0">
      <header className="flex w-full items-center gap-[31px] text-[#0C0F24] justify-center max-md:max-w-full">
        <div className="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
          <h1 className="min-h-[30px] w-full text-2xl font-semibold leading-none max-md:max-w-full text-[#0C0F24]">
            Your Information
          </h1>
          <p className="text-[#0C0F24] text-sm font-normal leading-none max-md:max-w-full">
            License Business Information
          </p>
        </div>
      </header>

      {/* Desktop tab navigation */}
      <div className="hidden md:block">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Mobile tab selector */}
      <div className="md:hidden">
        <MobileTabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          completedTabs={completedTabs}
        />
      </div>

      <section className="mt-4">
        {activeTab === 'mailing-address' && (
          <AddressForm
            onSubmit={handleFormSubmit}
            onContinue={handleContinue}
          />
        )}
        {activeTab === 'license-business' && (
          <div className="text-center py-8 text-[#858791]">
            License Business Information form will be implemented here.
          </div>
        )}
        {activeTab === 'license-details' && (
          <div className="text-center py-8 text-[#858791]">
            License Details form will be implemented here.
          </div>
        )}
        {activeTab === 'business-disclosure' && (
          <div className="text-center py-8 text-[#858791]">
            Business Disclosure form will be implemented here.
          </div>
        )}
        {activeTab === 'team-function' && (
          <div className="text-center py-8 text-[#858791]">
            Team Function form will be implemented here.
          </div>
        )}
      </section>
    </main>
  );
};

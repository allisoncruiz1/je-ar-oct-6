import React, { useState } from 'react';
import { AddressForm } from './AddressForm';
import { SectionHeader } from './SectionHeader';

interface MainContentProps {
  onFormSubmit?: (data: any) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onFormSubmit }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    'Mailing Address',
    'License Business Info',
    'License Details',
    'Business Disclosure',
    'Team Function'
  ];

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    
    // Mark current section as completed
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
    }
    
    onFormSubmit?.(data);
  };

  const handleContinue = () => {
    console.log('Continue clicked');
    
    // Mark current section as completed
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
    }
    
    // Navigate to next section
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
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

      <SectionHeader 
        currentSection={currentSection}
        totalSections={sections.length}
        sectionTitle={sections[currentSection]}
      />

      <section className="mt-4">
        {currentSection === 0 && (
          <AddressForm
            onSubmit={handleFormSubmit}
            onContinue={handleContinue}
          />
        )}
        {currentSection === 1 && (
          <div className="text-center py-8 text-[#858791]">
            License Business Information form will be implemented here.
          </div>
        )}
        {currentSection === 2 && (
          <div className="text-center py-8 text-[#858791]">
            License Details form will be implemented here.
          </div>
        )}
        {currentSection === 3 && (
          <div className="text-center py-8 text-[#858791]">
            Business Disclosure form will be implemented here.
          </div>
        )}
        {currentSection === 4 && (
          <div className="text-center py-8 text-[#858791]">
            Team Function form will be implemented here.
          </div>
        )}
      </section>
    </main>
  );
};

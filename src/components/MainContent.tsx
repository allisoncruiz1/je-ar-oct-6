import React, { useState, useEffect } from 'react';
import { AddressForm } from './AddressForm';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';

interface MainContentProps {
  onFormSubmit?: (data: any) => void;
  onCanContinueChange?: (canContinue: boolean) => void;
  onContinueHandlerChange?: (handler: (() => void) | null) => void;
  onSaveResume?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onFormSubmit, onCanContinueChange, onContinueHandlerChange, onSaveResume }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [formComplete, setFormComplete] = useState(false);

  const sections = [
    'Mailing Address',
    'License Business Info',
    'License Details',
    'Business Disclosures',
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

  const handleBack = () => {
    console.log('Back clicked');
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Effect to update the continue handler and state
  const canProceed = currentSection === 0 ? formComplete : true;
  useEffect(() => {
    onContinueHandlerChange?.(handleContinue);
    onCanContinueChange?.(canProceed);
  }, [handleContinue, canProceed, onContinueHandlerChange, onCanContinueChange]);

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
            onFormValidChange={setFormComplete}
            onSaveResume={onSaveResume}
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

      <div className="hidden md:block border-t border-border mt-4 pt-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentSection === 0}
            aria-label="Go back to previous step"
          >
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSaveResume}
              aria-label="Save and resume application later"
            >
              Save & Resume Later
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!canProceed}
              aria-label="Continue to next step"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
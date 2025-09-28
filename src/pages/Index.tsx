import React, { useState, useRef, useCallback } from 'react';
// Force rebuild
import { Header } from '@/components/Header';
import { SideNavigation } from '@/components/SideNavigation';
import { MainContent } from '@/components/MainContent';
import { MobileProgressStepper } from '@/components/MobileProgressStepper';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    'Mailing Address',
    'License Business Info', 
    'License Details',
    'Business Disclosures',
    'Team Function'
  ];

  const getMainStep = (section: number) => {
    if (section <= 2) return 0; // Your Information
    if (section === 3) return 1; // Business Disclosures  
    return 2; // Team Function
  };

  const getMainStepInfo = (section: number) => {
    const step = getMainStep(section);
    const mainSteps = [
      { title: 'Your Information', description: 'Personal & Business Details' },
      { title: 'Business Disclosures', description: 'Business Compliance' }, 
      { title: 'Team Function', description: 'Team Configuration' }
    ];
    return { ...mainSteps[step], stepNumber: step + 1 };
  };

  const getOverallProgress = (section: number) => {
    // Progress within "Your Information" step: 20% per section completed
    return (section + 1) * 20;
  };

  const handleSaveResume = () => {
    console.log('Save & Resume Later clicked');
    // Implement save functionality
  };

  const handleHelpClick = () => {
    console.log('Help clicked');
    // Implement help functionality
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    // Handle form submission
  };

  return (
    <div className="bg-[rgba(239,241,247,1)] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header onHelpClick={handleHelpClick} />
      </div>
      
      <div className="flex w-full flex-col items-stretch px-6 max-md:px-3 pb-6 max-md:pb-4">
        <div className="flex w-full flex-col items-stretch">
          {/* Mobile progress stepper */}
          <div className="md:hidden sticky top-20 z-50 mt-2 bg-[rgba(239,241,247,1)] pt-2 pb-2">
            <MobileProgressStepper 
              currentSection={currentSection}
              mainStepInfo={getMainStepInfo(currentSection)}
              overallProgress={getOverallProgress(currentSection)}
              sectionName={sections[currentSection]}
              totalMainSteps={5}
            />
          </div>

          <div className="flex w-full gap-6 flex-wrap mt-4 max-md:flex-col max-md:gap-4 max-md:mt-0">
            {/* Desktop sticky sidebar */}
            <div className="max-md:hidden sticky top-20 self-start">
              <SideNavigation currentStep={getMainStep(currentSection)} progress={getOverallProgress(currentSection)} />
            </div>
            <MainContent 
              key="wizard-v1"
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              completedSections={completedSections}
              setCompletedSections={setCompletedSections}
              sections={sections}
              onFormSubmit={handleFormSubmit} 
              onSaveResume={handleSaveResume}
            />
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default Index;

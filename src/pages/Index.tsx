import React, { useState, useRef, useCallback } from 'react';
// Force rebuild
import { Header } from '@/components/Header';
import { SideNavigation } from '@/components/SideNavigation';
import { MainContent } from '@/components/MainContent';
import { MobileProgressBar } from '@/components/MobileProgressBar';
import { SubStepDrawer } from '@/components/SubStepDrawer';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [isSubStepDrawerOpen, setIsSubStepDrawerOpen] = useState(false);

  const sections = [
    'Mailing Address',
    'License Business Info', 
    'License Details',
    'Business Overview',
    'Team Function',
    'Sponsor',
    'Payment Info',
    'Direct Deposit',
    'Review Application'
  ];

  const getMainStep = (section: number) => {
    if (section <= 4) return 0; // Your Information (sections 0-4)
    if (section === 5) return 1; // Sponsor
    if (section <= 7) return 2; // Financial Info (sections 6-7)
    return 3; // Additional steps
  };

  const getMainStepInfo = (section: number) => {
    const step = getMainStep(section);
    const mainSteps = [
      { title: 'Your Information', description: 'Personal and Business Details' },
      { title: 'Sponsor', description: 'Select Sponsor' }, 
      { title: 'Financial Info', description: 'Payment and Direct Deposit' },
      { title: 'Additional Steps', description: 'Final Configuration' }
    ];
    return { ...mainSteps[step], stepNumber: step + 1 };
  };

  const getOverallProgress = (section: number) => {
    // Progress starts at 0% and increases based on completed sections
    // Each of the 5 main steps represents 20% of total progress
    const step = getMainStep(section);
    return step * 20;
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
          {/* Mobile navigation */}
          <div className="md:hidden sticky top-20 z-50 mt-2 bg-[rgba(239,241,247,1)] pt-2 pb-0">
            <MobileProgressBar
              currentStep={getMainStep(currentSection)}
              currentSection={currentSection}
              completedSections={completedSections}
              onOpenDrawer={() => setIsSubStepDrawerOpen(true)}
              onSaveResume={handleSaveResume}
            />
          </div>

          {/* Sub-step drawer for mobile */}
          <SubStepDrawer
            isOpen={isSubStepDrawerOpen}
            onClose={() => setIsSubStepDrawerOpen(false)}
            currentSection={currentSection}
            completedSections={completedSections}
            onSubStepSelect={setCurrentSection}
          />

          <div className="flex w-full gap-6 flex-wrap mt-4 max-md:flex-col max-md:gap-4 max-md:mt-0">
            {/* Desktop sticky sidebar */}
            <div className="max-md:hidden sticky top-20 self-start">
              <SideNavigation 
                currentStep={getMainStep(currentSection)} 
                progress={getOverallProgress(currentSection)}
                currentSection={currentSection}
                completedSections={completedSections}
              />
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

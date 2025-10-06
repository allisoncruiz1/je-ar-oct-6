import React, { useState, useEffect } from 'react';
import { NavigationStep } from './NavigationStep';
import { SubNavigationStep } from './SubNavigationStep';
import { ProgressIndicator } from './ProgressIndicator';

interface SideNavigationProps {
  currentStep?: number;
  progress?: number;
  currentSection?: number;
  completedSections?: number[];
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ 
  currentStep = 0, 
  progress = 0,
  currentSection = 0,
  completedSections = []
}) => {
  const [isYourInfoExpanded, setIsYourInfoExpanded] = useState(currentSection <= 4);
  const [isFinancialInfoExpanded, setIsFinancialInfoExpanded] = useState(currentSection >= 6 && currentSection <= 7);
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(currentSection >= 9 && currentSection <= 10);

  // Update expansion state when currentSection changes
  useEffect(() => {
    if (currentSection <= 4) {
      setIsYourInfoExpanded(true);
      setIsFinancialInfoExpanded(false);
      setIsDocumentsExpanded(false);
    } else if (currentSection >= 6 && currentSection <= 7) {
      setIsYourInfoExpanded(false);
      setIsFinancialInfoExpanded(true);
      setIsDocumentsExpanded(false);
    } else if (currentSection >= 9 && currentSection <= 10) {
      setIsYourInfoExpanded(false);
      setIsFinancialInfoExpanded(false);
      setIsDocumentsExpanded(true);
    } else {
      // For other sections, collapse all
      setIsYourInfoExpanded(false);
      setIsFinancialInfoExpanded(false);
      setIsDocumentsExpanded(false);
    }
  }, [currentSection]);

  const yourInfoSubSteps = [
    'Mailing Address',
    'License & Business Info', 
    'License Details',
    'Business Overview',
    'Team Function'
  ];

  const financialInfoSubSteps = [
    'Payment Info',
    'Direct Deposit'
  ];

  const documentsSubSteps = [
    'W9',
    'Document Signing'
  ];

  const steps = [
    {
      title: "Your Information",
      description: "Personal and Business Details",
      isActive: currentStep === 0,
      isCompleted: currentStep >= 1,
      hasSubSteps: true,
      isExpanded: isYourInfoExpanded,
      onToggleExpanded: () => setIsYourInfoExpanded(!isYourInfoExpanded)
    },
    {
      title: "Sponsor",
      description: "Select Sponsor",
      isActive: currentStep === 1,
      isCompleted: currentStep > 1
    },
    {
      title: "Financial Info",
      description: "Payment and Direct Deposit",
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
      hasSubSteps: true,
      isExpanded: isFinancialInfoExpanded,
      onToggleExpanded: () => setIsFinancialInfoExpanded(!isFinancialInfoExpanded)
    },
    {
      title: "Review",
      description: "Review Application",
      isActive: currentStep === 3,
      isCompleted: currentStep > 3
    },
    {
      title: "Documents",
      description: "W9 and Document Signing",
      isActive: currentStep === 4,
      isCompleted: currentStep > 4,
      hasSubSteps: true,
      isExpanded: isDocumentsExpanded,
      onToggleExpanded: () => setIsDocumentsExpanded(!isDocumentsExpanded)
    }
  ];

  return (
    <nav 
      className="items-stretch shadow-[2px_4px_6px_0_rgba(12,15,36,0.08)] flex flex-col w-[260px] min-w-[260px] shrink-0 self-start bg-white pt-4 pb-3 rounded-lg"
      aria-label="Application progress navigation"
    >
      <div className="w-full px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <NavigationStep {...step} />
            
            {/* Show sub-steps for "Your Information" when expanded */}
            {step.title === "Your Information" && isYourInfoExpanded && (
              <div className="ml-3 border-l-2 border-[#1B489B] pl-0 py-2">
                {yourInfoSubSteps.map((subStepTitle, subIndex) => (
                  <SubNavigationStep
                    key={subStepTitle}
                    title={subStepTitle}
                    isActive={currentSection === subIndex}
                    isCompleted={completedSections.includes(subIndex)}
                  />
                ))}
              </div>
            )}

            {/* Show sub-steps for "Financial Info" when expanded */}
            {step.title === "Financial Info" && isFinancialInfoExpanded && (
              <div className="ml-3 border-l-2 border-[#1B489B] pl-0 py-2">
                {financialInfoSubSteps.map((subStepTitle, subIndex) => (
                  <SubNavigationStep
                    key={subStepTitle}
                    title={subStepTitle}
                    isActive={currentSection === 6 + subIndex}
                    isCompleted={completedSections.includes(6 + subIndex)}
                  />
                ))}
              </div>
            )}

            {/* Show sub-steps for "Documents" when expanded */}
            {step.title === "Documents" && isDocumentsExpanded && (
              <div className="ml-3 border-l-2 border-[#1B489B] pl-0 py-2">
                {documentsSubSteps.map((subStepTitle, subIndex) => (
                  <SubNavigationStep
                    key={subStepTitle}
                    title={subStepTitle}
                    isActive={currentSection === 9 + subIndex}
                    isCompleted={completedSections.includes(9 + subIndex)}
                  />
                ))}
              </div>
            )}
            
            {index < steps.length - 1 && (
              <div className="flex w-full items-center gap-2.5">
                <div className={`ml-3 flex min-h-[29px] w-0.5 my-auto ${
                  step.isCompleted || steps[index + 1].isActive ? 'bg-[#1B489B]' : 'bg-[#CECFD3]'
                }`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-[rgba(239,241,247,1)] flex min-h-px w-full mt-3" />
      <ProgressIndicator percentage={progress} />
    </nav>
  );
};

import React from 'react';
import { NavigationStep } from './NavigationStep';
import { ProgressIndicator } from './ProgressIndicator';

interface SideNavigationProps {
  currentStep?: number;
  progress?: number;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ 
  currentStep = 0, 
  progress = 0 
}) => {
  const steps = [
    {
      title: "Your Information",
      description: "Personal and Business Details",
      isActive: currentStep === 0,
      isCompleted: currentStep > 0
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
      isCompleted: currentStep > 2
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
      isCompleted: currentStep > 4
    }
  ];

  return (
    <nav 
      className="items-stretch shadow-[2px_4px_6px_0_rgba(12,15,36,0.08)] flex min-w-60 flex-col grow shrink w-52 bg-white pt-4 pb-3 rounded-lg"
      aria-label="Application progress navigation"
    >
      <div className="w-full px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <NavigationStep {...step} />
            {index < steps.length - 1 && (
              <div className="flex w-full items-center gap-2.5">
                <div className={`self-stretch flex min-h-[29px] w-0.5 my-auto ${
                  step.isActive ? 'bg-[#1B489B]' : 'bg-[#CECFD3]'
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

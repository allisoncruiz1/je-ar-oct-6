import React from 'react';
import { NavigationStep } from './NavigationStep';
import { ProgressIndicator } from './ProgressIndicator';

interface SideNavigationProps {
  currentStep?: number;
  progress?: number;
  onSectionChange?: (section: number) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ 
  currentStep = 0, 
  progress = 0,
  onSectionChange
}) => {
  const steps = [
    {
      title: "Mailing Address",
      description: "Personal and Business Details",
      isActive: currentStep === 0,
      isCompleted: currentStep > 0
    },
    {
      title: "License Business Info",
      description: "Business Information",
      isActive: currentStep === 1,
      isCompleted: currentStep > 1
    },
    {
      title: "License Details",
      description: "License Information",
      isActive: currentStep === 2,
      isCompleted: currentStep > 2
    },
    {
      title: "Business Disclosure",
      description: "Business Disclosures",
      isActive: currentStep === 3,
      isCompleted: currentStep > 3
    },
    {
      title: "Team Function",
      description: "Team Information",
      isActive: currentStep === 4,
      isCompleted: currentStep > 4
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
            <div 
              className={`cursor-pointer hover:bg-gray-50 rounded p-1 -m-1 transition-colors ${
                onSectionChange ? '' : 'cursor-default'
              }`}
              onClick={() => onSectionChange?.(index)}
            >
              <NavigationStep {...step} />
            </div>
            {index < steps.length - 1 && (
              <div className="flex w-full items-center gap-2.5">
                <div className={`ml-3 flex min-h-[29px] w-0.5 my-auto ${
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

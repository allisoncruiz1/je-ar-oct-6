import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MobileNavigationProps {
  currentStep: number;
  currentSection: number;
  progress: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentStep,
  currentSection,
  progress
}) => {
  const mainSteps = [
    "Your Information",
    "Sponsor", 
    "Financial Info",
    "Review",
    "Documents"
  ];

  const subSteps = [
    'Mailing Address',
    'License Business Info', 
    'License Details',
    'Business Overview',
    'Team Function'
  ];

  const getCurrentMainStep = () => mainSteps[currentStep] || mainSteps[0];
  const getCurrentSubStep = () => {
    // Only show sub-step if we're in "Your Information" step
    if (currentStep === 0 && currentSection < subSteps.length) {
      return subSteps[currentSection];
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
      {/* Main Step and Sub-step */}
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm font-semibold text-foreground">
          {getCurrentMainStep()}
        </div>
        {getCurrentSubStep() && (
          <>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {getCurrentSubStep()}
            </div>
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="bg-muted h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {progress}%
        </div>
      </div>
    </div>
  );
};
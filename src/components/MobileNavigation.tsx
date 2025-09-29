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
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-muted-foreground">
          Step {currentStep + 1} of {mainSteps.length}
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {progress}%
        </div>
      </div>

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

      {/* Progress Bar with step indicators */}
      <div className="space-y-2">
        <div className="relative">
          <div className="bg-muted h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between absolute -top-1 left-0 right-0">
            {mainSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border-2 ${
                  index <= currentStep
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Next step indicator */}
        {currentStep < mainSteps.length - 1 && (
          <div className="text-xs text-muted-foreground">
            Next: {mainSteps[currentStep + 1]}
          </div>
        )}
      </div>
    </div>
  );
};
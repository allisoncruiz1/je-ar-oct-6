import React from 'react';
interface MobileProgressStepperProps {
  currentStep?: number;
  progress?: number;
  currentSection?: number;
  sectionTitle?: string;
}
export const MobileProgressStepper: React.FC<MobileProgressStepperProps> = ({
  currentStep = 0,
  progress = 0,
  currentSection = 0,
  sectionTitle = "Your Information"
}) => {
  const steps = ['Your Information', 'Sponsor', 'Financial Info', 'Review', 'Documents'];
  
  // Calculate which main step we're on
  const mainStep = currentSection <= 2 ? 0 : Math.min(currentSection - 1, steps.length - 1);
  const currentStepTitle = currentSection <= 2 ? 'Your Information' : sectionTitle;
  
  // Calculate sub-step indicator
  const getStepIndicator = () => {
    if (currentSection <= 2) {
      return `Step 1.${currentSection + 1} of 1.3`;
    } else {
      return `Step ${currentSection - 1} of ${steps.length - 2}`;
    }
  };

  return (
    <div className="bg-white px-4 py-2 rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          {/* Primary: Main step title */}
          <h3 className="text-[#0C0F24] font-bold text-base">
            {currentStepTitle}
          </h3>
          
          {/* Tertiary: Small progress dots */}
          <div className="flex items-center gap-0.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full ${
                  index <= mainStep ? 'bg-[#1B489B]' : 'bg-[#E5E5E5]'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Tertiary: Progress percentage */}
        <span className="text-xs text-[#858791]">
          {progress}%
        </span>
      </div>
      
      {/* Secondary: Sub-step indicator */}
      <div className="mb-2">
        <span className="text-xs font-medium text-[#858791]">
          {getStepIndicator()}
        </span>
      </div>
      
      {/* Thin progress bar */}
      <div className="bg-[rgba(0,0,0,0.1)] h-0.5 rounded-full">
        <div 
          className="bg-[#1B489B] h-full rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
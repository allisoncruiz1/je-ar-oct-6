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
  
  return (
    <div className="bg-white px-4 py-2 rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[#0C0F24] font-semibold text-sm">
            {currentStepTitle}
          </h3>
          {/* Step dots */}
          <div className="flex items-center gap-1">
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
        <span className="text-xs font-semibold text-[#0C0F24]">
          {progress}%
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
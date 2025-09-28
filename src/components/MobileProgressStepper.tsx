import React from 'react';
interface MobileProgressStepperProps {
  currentSection: number;
  mainStepInfo: {
    title: string;
    description: string;
    stepNumber: number;
  };
  overallProgress: number;
  sectionName: string;
  totalMainSteps: number;
}
export const MobileProgressStepper: React.FC<MobileProgressStepperProps> = ({
  currentSection,
  mainStepInfo,
  overallProgress,
  sectionName,
  totalMainSteps
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      {/* Primary Level: Main step title */}
      <div className="mb-2">
        <h1 className="text-[#0C0F24] font-bold text-xl">
          {mainStepInfo.title}
        </h1>
      </div>

      {/* Secondary Level: Step context with description */}
      <div className="mb-3">
        <p className="text-[#858791] text-sm">
          Step {mainStepInfo.stepNumber} of {totalMainSteps} • {mainStepInfo.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-[rgba(0,0,0,0.1)] h-1.5 rounded-full">
        <div 
          className="bg-[#1B489B] h-full rounded-full transition-all duration-300" 
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};
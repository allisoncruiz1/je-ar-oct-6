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
    <div className="bg-gradient-to-r from-white to-slate-50/80 p-5 rounded-2xl shadow-lg border border-slate-100/60 mb-3 mx-1">
      {/* Mobile-specific header with step indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1B489B] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{mainStepInfo.stepNumber}</span>
          </div>
          <div className="text-[#858791] text-xs font-medium px-2 py-1 bg-slate-100 rounded-full">
            {totalMainSteps - mainStepInfo.stepNumber} steps left
          </div>
        </div>
        <div className="text-[#1B489B] text-lg font-bold">
          {overallProgress}%
        </div>
      </div>

      {/* Primary Level: Main step title */}
      <div className="mb-2">
        <h1 className="text-[#0C0F24] font-bold text-xl leading-tight">
          {mainStepInfo.title}
        </h1>
      </div>

      {/* Secondary Level: Enhanced description with mobile context */}
      <div className="mb-4">
        <p className="text-[#858791] text-sm leading-relaxed">
          {mainStepInfo.description}
        </p>
      </div>

      {/* Enhanced progress bar with mobile-optimized design */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#858791]">
          <span>Progress</span>
          <span>Step {mainStepInfo.stepNumber} of {totalMainSteps}</span>
        </div>
        <div className="relative">
          <div className="bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#1B489B] to-blue-600 h-full rounded-full transition-all duration-500 ease-out relative" 
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          {/* Progress milestone indicators */}
          <div className="absolute top-0 left-0 w-full h-2 flex justify-between">
            {Array.from({ length: totalMainSteps }, (_, i) => (
              <div 
                key={i}
                className={`w-1 h-2 rounded-full ${
                  i < mainStepInfo.stepNumber ? 'bg-[#1B489B]' : 'bg-slate-300'
                }`}
                style={{ marginLeft: i === 0 ? '0' : '-2px' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
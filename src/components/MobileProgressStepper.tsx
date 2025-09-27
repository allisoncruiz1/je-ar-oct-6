import React from 'react';

interface MobileProgressStepperProps {
  currentStep?: number;
  progress?: number;
}

export const MobileProgressStepper: React.FC<MobileProgressStepperProps> = ({ 
  currentStep = 0, 
  progress = 0 
}) => {
  const steps = [
    { title: "Get Started", description: "Welcome" },
    { title: "Address", description: "Your location" },
    { title: "Property Details", description: "Home info" },
    { title: "Documents", description: "Upload files" },
    { title: "Review", description: "Final check" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      {/* Current step indicator */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0C0F24]">
            Step {currentStep + 1} of {steps.length}
          </h3>
          <p className="text-xs text-[#858791]">
            Your Information
          </p>
        </div>
        <div className="text-xs font-semibold text-[#0C0F24]">
          {progress}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-[rgba(0,0,0,0.1)] h-2 rounded-full mb-3">
        <div 
          className="bg-[#1B489B] h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1 ${
              index <= currentStep 
                ? 'bg-[#1B489B] text-white' 
                : 'bg-[#E5E5E5] text-[#858791]'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block absolute w-full h-0.5 top-3 left-1/2 transform -translate-y-1/2 ${
                index < currentStep ? 'bg-[#1B489B]' : 'bg-[#E5E5E5]'
              }`} style={{ zIndex: -1 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
interface MobileProgressBarProps {
  currentStep: number;
  currentSection: number;
  completedSections: number[];
  onOpenDrawer: () => void;
  onSaveResume?: () => void;
}
export const MobileProgressBar: React.FC<MobileProgressBarProps> = ({
  currentStep,
  currentSection,
  completedSections,
  onOpenDrawer,
  onSaveResume
}) => {
  const mainSteps = [{
    title: "Your Information",
    subStepCount: 5
  }, {
    title: "Sponsor",
    subStepCount: 0
  }, {
    title: "Financial Info",
    subStepCount: 0
  }, {
    title: "Review",
    subStepCount: 0
  }, {
    title: "Documents",
    subStepCount: 0
  }];
  const currentStepData = mainSteps[currentStep];

  // Calculate how many sub-steps are completed for the current main step
  const getCompletedSubStepsCount = () => {
    if (currentStep === 0) {
      // For "Your Information" (sections 0-4)
      return completedSections.filter(s => s >= 0 && s <= 4).length;
    }
    return 0;
  };
  const completedSubSteps = getCompletedSubStepsCount();
  const hasSubSteps = currentStepData.subStepCount > 0;
  return <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-border">
      {/* Horizontal Progress Stepper */}
      <div className="flex items-center justify-between mb-3">
        {mainSteps.map((step, index) => <React.Fragment key={step.title}>
            <div className="flex flex-col items-center gap-1">
              {/* Step Circle Indicator */}
              {index < currentStep ? (
                // Completed step - filled circle with checkmark
                <div className="w-7 h-7 rounded-full bg-[#1B489B] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : index === currentStep ? (
                // Active step - double circle design
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border-4 border-[#1B489B]/40">
                  <div className="w-2.5 h-2.5 bg-[#1B489B] rounded-full" />
                </div>
              ) : (
                // Future step - gray circle
                <div className="w-7 h-7 rounded-full bg-[#CECFD3] flex items-center justify-center" />
              )}
            </div>
            {/* Connector Line */}
            {index < mainSteps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${index < currentStep ? 'bg-[#1B489B]' : 'bg-[#CECFD3]'}`} />}
          </React.Fragment>)}
      </div>

      {/* Current step title */}
      <div className="text-[#0C0F24] text-base font-bold leading-tight">
        {currentStepData.title}
      </div>
    </div>;
};
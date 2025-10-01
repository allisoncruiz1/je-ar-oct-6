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
  return <div className="bg-white rounded-lg p-3 shadow-md mb-4 border border-border">
      {/* Progress dots */}
      <div className="flex items-center justify-between mb-3">
        {mainSteps.map((step, index) => <React.Fragment key={step.title}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${index < currentStep ? 'bg-brand-blue border-brand-blue' : index === currentStep ? 'bg-background border-brand-blue' : 'bg-background border-muted-foreground/30'}`}>
                {index < currentStep ? <Check className="w-4 h-4 text-white" /> : <span className={`text-xs font-medium ${index === currentStep ? 'text-brand-blue' : 'text-muted-foreground'}`}>
                    {index + 1}
                  </span>}
              </div>
            </div>
            {index < mainSteps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${index < currentStep ? 'bg-brand-blue' : 'bg-muted-foreground/30'}`} />}
          </React.Fragment>)}
      </div>

      {/* Current step title */}
      <div className="text-lg font-semibold tracking-tight text-foreground">
        {currentStepData.title}
      </div>
    </div>;
};
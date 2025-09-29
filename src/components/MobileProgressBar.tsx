import React from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface MobileProgressBarProps {
  currentStep: number;
  currentSection: number;
  completedSections: number[];
  onOpenDrawer: () => void;
}

export const MobileProgressBar: React.FC<MobileProgressBarProps> = ({
  currentStep,
  currentSection,
  completedSections,
  onOpenDrawer
}) => {
  const mainSteps = [
    { title: "Your Information", subStepCount: 5 },
    { title: "Sponsor", subStepCount: 0 },
    { title: "Financial Info", subStepCount: 0 },
    { title: "Review", subStepCount: 0 },
    { title: "Documents", subStepCount: 0 }
  ];

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

  return (
    <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
      {/* Progress dots */}
      <div className="flex items-center justify-between mb-3">
        {mainSteps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  index < currentStep
                    ? 'bg-primary border-primary'
                    : index === currentStep
                    ? 'bg-background border-primary'
                    : 'bg-background border-muted-foreground/30'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <span
                    className={`text-xs font-medium ${
                      index === currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
            </div>
            {index < mainSteps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current step title - tappable if has sub-steps */}
      <button
        onClick={hasSubSteps ? onOpenDrawer : undefined}
        disabled={!hasSubSteps}
        className={`w-full text-left ${hasSubSteps ? 'active:opacity-70' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-base font-semibold text-foreground">
              {currentStepData.title}
            </div>
            {hasSubSteps && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span>Tap to view</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

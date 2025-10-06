import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isSubStepsExpanded, setIsSubStepsExpanded] = useState(false);
  const mainSteps = [{
    title: "Your Information",
    description: "Personal and Business Details",
    subStepCount: 5
  }, {
    title: "Sponsor",
    description: "Select Sponsor",
    subStepCount: 0
  }, {
    title: "Financial Info",
    description: "Payment and Direct Deposit",
    subStepCount: 2
  }, {
    title: "Review",
    description: "Review Application",
    subStepCount: 0
  }, {
    title: "Documents",
    description: "W9 and Document Signing",
    subStepCount: 0
  }];
  const yourInfoSubSteps = ['Mailing Address', 'License & Business Info', 'License Details', 'Business Overview', 'Team Function'];
  const financialInfoSubSteps = ['Payment Info', 'Direct Deposit'];
  const currentStepData = mainSteps[currentStep];

  // Calculate how many sub-steps are completed for the current main step
  const getCompletedSubStepsCount = () => {
    if (currentStep === 0) {
      // For "Your Information" (sections 0-4)
      return completedSections.filter(s => s >= 0 && s <= 4).length;
    }
    if (currentStep === 2) {
      // For "Financial Info" (sections 6-7)
      return completedSections.filter(s => s >= 6 && s <= 7).length;
    }
    return 0;
  };
  const completedSubSteps = getCompletedSubStepsCount();
  const hasSubSteps = currentStepData.subStepCount > 0;
  
  // Determine which substeps to show
  const isFinancialInfo = currentStep === 2;
  const subStepsToShow = isFinancialInfo ? financialInfoSubSteps : yourInfoSubSteps;
  const subStepStartIndex = isFinancialInfo ? 6 : 0;
  return <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-border">
      {/* Horizontal Progress Stepper */}
      <div className="flex items-center justify-between mb-3">
        {mainSteps.map((step, index) => <React.Fragment key={step.title}>
            <div className="flex flex-col items-center gap-1">
              {/* Step Circle Indicator */}
              {index < currentStep ?
          // Completed step - filled circle with checkmark
          <div className="w-7 h-7 rounded-full bg-[#1B489B] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div> : index === currentStep ?
          // Active step - double circle design
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border-4 border-[#1B489B]/40">
                  <div className="w-2.5 h-2.5 bg-[#1B489B] rounded-full" />
                </div> :
          // Future step - gray double circle design
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 border-[#CECFD3]">
                  <div className="w-2 h-2 bg-[#CECFD3] rounded-full" />
                </div>}
            </div>
            {/* Connector Line */}
            {index < mainSteps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${index < currentStep ? 'bg-[#1B489B]' : 'bg-[#CECFD3]'}`} />}
          </React.Fragment>)}
      </div>

      {/* Current step title with dropdown for sub-steps */}
      <div className={`flex items-start justify-between ${hasSubSteps ? 'cursor-pointer' : ''}`} onClick={hasSubSteps ? () => setIsSubStepsExpanded(!isSubStepsExpanded) : undefined}>
        <div>
          <h1 className="text-[#0C0F24] font-bold leading-tight text-2xl">
            {currentStepData.title}
          </h1>
          <p className="text-[#858791] text-sm mt-1 font-normal">
            {currentStepData.description}
          </p>
        </div>
        {hasSubSteps && <div className="ml-2 mt-1 flex-shrink-0">
            {isSubStepsExpanded ? <ChevronUp className="w-5 h-5 text-[#858791]" /> : <ChevronDown className="w-5 h-5 text-[#858791]" />}
          </div>}
      </div>

      {/* Sub-steps dropdown */}
      {hasSubSteps && isSubStepsExpanded && <div className="mt-3 pt-3 border-t border-[#CECFD3] space-y-2 bg-white">
          {subStepsToShow.map((subStep, index) => {
            const sectionIndex = subStepStartIndex + index;
            return (
              <div key={subStep} className={`flex items-center gap-2 py-1 px-2 rounded ${currentSection === sectionIndex ? 'bg-[#F5F7FA]' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${completedSections.includes(sectionIndex) ? 'bg-[#1B489B]' : currentSection === sectionIndex ? 'bg-[#1B489B]' : 'bg-[#CECFD3]'}`} />
                <span className={`text-sm ${currentSection === sectionIndex ? 'text-[#0C0F24] font-semibold' : 'text-[#858791]'}`}>
                  {subStep}
                </span>
              </div>
            );
          })}
        </div>}
    </div>;
};
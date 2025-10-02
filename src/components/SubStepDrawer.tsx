import React from 'react';
import { Check, Circle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';

interface SubStepDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: number;
  completedSections: number[];
  onSubStepSelect: (section: number) => void;
}

export const SubStepDrawer: React.FC<SubStepDrawerProps> = ({
  isOpen,
  onClose,
  currentSection,
  completedSections,
  onSubStepSelect
}) => {
  const yourInfoSubSteps = [
    { title: 'Mailing Address', section: 0 },
    { title: 'License Business Info', section: 1 },
    { title: 'License Details', section: 2 },
    { title: 'Business Overview', section: 3 },
    { title: 'Team Function', section: 4 }
  ];

  const financialInfoSubSteps = [
    { title: 'Payment Info', section: 6 },
    { title: 'Direct Deposit', section: 7 }
  ];

  // Determine which set of substeps to show based on current section
  const isFinancialInfoSection = currentSection >= 6 && currentSection <= 7;
  const subSteps = isFinancialInfoSection ? financialInfoSubSteps : yourInfoSubSteps;
  const drawerTitle = isFinancialInfoSection ? 'Financial Info Steps' : 'Your Information Steps';

  const handleStepClick = (section: number) => {
    onSubStepSelect(section);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>{drawerTitle}</SheetTitle>
          <SheetDescription>
            Complete all steps to proceed
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-2">
          {subSteps.map((step, index) => {
            const isActive = currentSection === step.section;
            const isCompleted = completedSections.includes(step.section);

            return (
              <button
                key={step.section}
                onClick={() => handleStepClick(step.section)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {step.title}
                  </div>
                  {isCompleted && !isActive && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Completed
                    </div>
                  )}
                  {isActive && (
                    <div className="text-xs text-primary mt-0.5">
                      Current step
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

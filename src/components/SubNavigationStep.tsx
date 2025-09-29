import React from 'react';
import { Check } from 'lucide-react';

interface SubNavigationStepProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const SubNavigationStep: React.FC<SubNavigationStepProps> = ({
  title,
  isActive,
  isCompleted
}) => {
  return (
    <div className={`flex w-full items-center gap-3 pl-8 py-1.5 ${
      isActive ? 'text-foreground' : 'text-muted-foreground'
    }`}>
      <div className="flex items-center justify-center w-4 h-4">
        {isCompleted ? (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary">
            <Check className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full ${
            isActive ? 'bg-primary' : 'bg-border'
          }`} />
        )}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${
          isActive ? 'text-foreground' : 'text-muted-foreground'
        }`}>
          {title}
        </div>
      </div>
    </div>
  );
};
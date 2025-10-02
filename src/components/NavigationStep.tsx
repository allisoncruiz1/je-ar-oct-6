import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavigationStepProps {
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  icon?: string;
  hasSubSteps?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export const NavigationStep: React.FC<NavigationStepProps> = ({
  title,
  description,
  isActive,
  isCompleted,
  icon,
  hasSubSteps = false,
  isExpanded = false,
  onToggleExpanded
}) => {
  const textColor = isActive ? 'text-[#0C0F24]' : (isCompleted ? 'text-[#1B489B]' : 'text-[#858791]');
  
  return (
    <div 
      className={`flex w-full items-center gap-3 ${textColor} ${
        hasSubSteps ? 'cursor-pointer' : ''
      }`}
      onClick={hasSubSteps ? onToggleExpanded : undefined}
    >
      <div className="self-stretch w-6 my-auto">
        {isActive ? (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border-4 border-[#1B489B]/40">
            <div className="w-2.5 h-2.5 bg-[#1B489B] rounded-full" />
          </div>
        ) : isCompleted ? (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1B489B]">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        ) : (
          <img
            src={icon || "https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/4e3d5214cad4db209fead5f8fa6a729014686048?placeholderIfAbsent=true"}
            alt=""
            className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
          />
        )}
      </div>
      <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
        <div className={`${textColor} text-base font-bold leading-none`}>
          {title}
        </div>
        <div className={`${textColor} text-xs font-normal`}>
          {description}
        </div>
      </div>
      {hasSubSteps && (
        <div className="ml-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#858791]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#858791]" />
          )}
        </div>
      )}
    </div>
  );
};

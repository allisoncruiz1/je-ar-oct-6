import React from 'react';

interface NavigationStepProps {
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  icon?: string;
}

export const NavigationStep: React.FC<NavigationStepProps> = ({
  title,
  description,
  isActive,
  isCompleted,
  icon
}) => {
  const textColor = isActive ? 'text-[#0C0F24]' : 'text-[#858791]';
  
  return (
    <div className={`flex w-full items-center gap-3 ${textColor}`}>
      <div className="self-stretch w-6 my-auto">
        {isActive ? (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 border-2 border-gray-400">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white">
              <div className="w-2.5 h-2.5 bg-[#1B489B] rounded-full" />
            </div>
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
        <div className={`${textColor} text-sm font-bold leading-none`}>
          {title}
        </div>
        <div className={`${textColor} text-xs font-normal`}>
          {description}
        </div>
      </div>
    </div>
  );
};

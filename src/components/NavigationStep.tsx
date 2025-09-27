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
          <div className="z-10 flex flex-col items-stretch justify-center px-0.5 py-[3px] rounded-[50%] border-[rgba(27,72,155,0.4)] border-solid border-4 max-md:mr-[-3px]">
            <div className="stroke-[1px] border flex flex-col items-stretch justify-center stroke-[#1B489B] px-0.5 py-2 rounded-[50%] border-[rgba(27,72,155,1)] border-solid">
              <div className="bg-[#1B489B] flex w-2 shrink-0 h-2 fill-[#1B489B] rounded-[50%]" />
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

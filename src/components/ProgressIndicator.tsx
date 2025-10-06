import React from 'react';

interface ProgressIndicatorProps {
  percentage: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ percentage }) => {
  return (
    <div className="self-center flex max-w-full w-[260px] items-center gap-3 mt-3 px-4">
      <div className="self-stretch flex flex-col items-stretch justify-center flex-1 shrink basis-[0%] my-auto py-2.5">
        <div className="bg-border flex min-h-1.5 max-w-full w-[190px] rounded-[50px] relative overflow-hidden">
          <div 
            className="bg-[hsl(var(--brand-blue))] h-full rounded-[50px] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-black text-sm font-semibold leading-none self-stretch my-auto">
        {percentage}%
      </div>
    </div>
  );
};

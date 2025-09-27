import React from 'react';

interface ProgressIndicatorProps {
  percentage: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ percentage }) => {
  return (
    <div className="flex flex-col items-center gap-2 w-8">
      <div className="bg-[rgba(0,0,0,0.1)] flex w-2 h-32 rounded-[50px] relative overflow-hidden">
        <div 
          className="bg-[#1B489B] w-full rounded-[50px] transition-all duration-300"
          style={{ height: `${percentage}%`, alignSelf: 'flex-end' }}
        />
      </div>
      <div className="text-black text-sm font-semibold leading-none">
        {percentage}%
      </div>
    </div>
  );
};

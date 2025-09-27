import React from 'react';

interface SectionHeaderProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  currentSection,
  totalSections,
  sectionTitle
}) => {
  // Calculate progress within "Your Information" (sections 0-2) or overall progress
  const isInYourInformation = currentSection <= 2;
  const progress = isInYourInformation 
    ? ((currentSection + 1) / 3) * 100  // Progress within "Your Information" 
    : ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="mt-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#0C0F24]">
          {sectionTitle}
        </h2>
        <span className="text-sm text-[#858791]">
          {isInYourInformation 
            ? `Step 1.${currentSection + 1} of 1.3`
            : `Step ${currentSection - 1} of ${totalSections - 2}`}
        </span>
      </div>
      
      <div className="w-full bg-[rgba(0,0,0,0.1)] rounded-full h-2">
        <div 
          className="bg-[#1B489B] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
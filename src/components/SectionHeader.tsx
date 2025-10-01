import React from 'react';
import { Separator } from '@/components/ui/separator';
interface SectionHeaderProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
  onSaveResume?: () => void;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  currentSection,
  totalSections,
  sectionTitle,
  onSaveResume
}) => {
  // Calculate progress within "Your Information" (sections 0-4) - 20% per section
  const isInYourInformation = currentSection <= 4;
  const progress = isInYourInformation ? (currentSection + 1) * 20 : (currentSection + 1) / totalSections * 100;
  return <div className="mt-0 mb-0">
      <div className="md:hidden flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-semibold text-foreground">{sectionTitle}</h1>
        <button
          onClick={onSaveResume}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap ml-4"
          aria-label="Save and resume application later"
        >
          Save & Resume
        </button>
      </div>
      
      {isInYourInformation && <div className="mb-4 flex justify-center md:hidden">
          
        </div>}
      
    </div>;
};
import React from 'react';
import { Separator } from '@/components/ui/separator';
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
  // Calculate progress within "Your Information" (sections 0-4) - 20% per section
  const isInYourInformation = currentSection <= 4;
  const progress = isInYourInformation ? (currentSection + 1) * 20 : (currentSection + 1) / totalSections * 100;
  return <div className="mt-0 mb-0">
      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-[#0C0F24] text-lg">
            {sectionTitle}
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">
          section 1 of 5
        </span>
      </div>
      {isInYourInformation && <div className="mb-4 flex justify-center md:hidden">
          
        </div>}
      <Separator className="mt-2" />
    </div>;
};
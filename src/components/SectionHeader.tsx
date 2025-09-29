import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SectionHeaderProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
  onBack?: () => void;
  showBack?: boolean;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  currentSection,
  totalSections,
  sectionTitle,
  onBack,
  showBack = false
}) => {
  // Calculate progress within "Your Information" (sections 0-4) - 20% per section
  const isInYourInformation = currentSection <= 4;
  const progress = isInYourInformation ? (currentSection + 1) * 20 
  : (currentSection + 1) / totalSections * 100;
  return <div className="mt-0 mb-0">
      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1 h-8 w-8"
              aria-label="Go back to previous step"
            >
              <ChevronLeft size={16} />
            </Button>
          )}
          <h2 className="font-semibold text-[#0C0F24] text-lg">
            {sectionTitle}
          </h2>
        </div>
        <span className="text-sm text-[#858791]">
          {isInYourInformation ? `Section 1.${currentSection + 1} of 1.5` : `Section ${currentSection + 1} of ${totalSections}`}
        </span>
      </div>
      {isInYourInformation && (
        <div className="mb-4 flex justify-center">
          <div className="relative h-2 w-64 overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-full bg-[#1B489B] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <Separator className="mt-2" />
    </div>;
};
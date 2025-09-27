import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  // Calculate progress within "Your Information" (sections 0-2) or overall progress
  const isInYourInformation = currentSection <= 2;
  const progress = isInYourInformation ? (currentSection + 1) / 3 * 100 // Progress within "Your Information" 
  : (currentSection + 1) / totalSections * 100;
  return <div className="mt-6 mb-4">
      <div className="flex items-center justify-between mb-3">
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
          <h2 className="font-semibold text-[#0C0F24] text-base">
            {sectionTitle}
          </h2>
        </div>
        <span className="text-sm text-[#858791]">
          {isInYourInformation ? `Step 1.${currentSection + 1} of 1.3` : `Step ${currentSection - 1} of ${totalSections - 2}`}
        </span>
      </div>
      
      <div className="w-full bg-[rgba(0,0,0,0.1)] rounded-full h-2">
        <div className="bg-[#1B489B] h-2 rounded-full transition-all duration-300" style={{
        width: `${progress}%`
      }} />
      </div>
    </div>;
};
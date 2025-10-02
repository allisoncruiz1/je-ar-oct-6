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
  const progress = isInYourInformation ? (currentSection + 1) * 20 : ((currentSection + 1) / totalSections) * 100;

  const title = currentSection === 5 ? 'Sponsor' : sectionTitle;
  const subtitle = currentSection === 5 ? 'Select Sponsor' : undefined;

  return (
    <header className="pt-4 pb-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      <Separator className="mt-4" />
    </header>
  );
};
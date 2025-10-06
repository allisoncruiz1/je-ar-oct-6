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
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">{sectionTitle}</h1>
      <Separator className="mt-4" />
    </div>
  );
};
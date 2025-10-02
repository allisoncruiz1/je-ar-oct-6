import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { MobileActionBar } from '@/components/MobileActionBar';

interface SponsorFormProps {
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
}

export const SponsorForm: React.FC<SponsorFormProps> = ({
  onContinue,
  onSaveResume,
  onBack,
  onFormValidChange,
  canContinue,
  showBack
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onFormValidChange?.(true);
  };

  const handleWatchVideo = () => {
    // Open video in new tab - replace with actual video URL
    window.open('https://www.youtube.com/watch?v=example', '_blank');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="space-y-6 flex-1 pb-24 md:pb-0">
        <div className="mb-6 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Understanding Your eXp Sponsor
          </h2>
        </div>

        {/* Video Player Section */}
        <div className="bg-muted rounded-lg p-12 flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <p className="text-foreground text-center text-lg">
            Click to watch 'Understanding your eXp Sponsor'
          </p>
          <Button
            variant="outline"
            onClick={handleWatchVideo}
            className="bg-background hover:bg-background/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Watch Video
          </Button>
        </div>

        {/* Sponsor Information */}
        <div className="space-y-4 mt-8">
          <p className="text-foreground font-semibold">
            What is a sponsor? A sponsor is the MOST INFLUENTIAL person in your decision to join eXp Realty. 
            A sponsor is different than a mentor or an agent you want to partner with in order to build revenue 
            share or a sales team, UNLESS that person was the most influential in your decision to join eXp Realty.
          </p>

          <ul className="space-y-3 list-disc pl-5 text-foreground">
            <li>
              If you do not choose a sponsor, eXp Realty will hold that sponsorship position and that selection 
              may not be modified in the future.
            </li>
            <li>
              Once the application is completed, changes in sponsorship will not be made under any circumstances.
            </li>
            <li className="font-semibold">
              IF YOU ARE UNCLEAR on who should be named as your sponsor, PLEASE DO NOT PROCEED with your application 
              until you are 100% certain.
            </li>
          </ul>

          <p className="text-foreground mt-6">
            The following selection is a significant decision which is irrevocable. If you do not have a sponsor, 
            eXp Realty will be selected as your sponsor and will hold that position going forward.
          </p>
        </div>

        {/* Acknowledgment Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleAcknowledge}
            disabled={acknowledged}
            size="lg"
            className="px-8"
          >
            I understand the sponsor policy.
          </Button>
        </div>
      </div>

      {/* Desktop action bar */}
      <div className="bg-background border-t border-border p-4 mt-6 max-md:hidden">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveResume}
            aria-label="Save and resume application later"
          >
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Go back to previous step"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={onContinue}
              disabled={!canContinue}
              aria-label="Continue to next step"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <MobileActionBar
        onBack={onBack}
        onContinue={onContinue}
        onSaveResume={onSaveResume}
        canContinue={canContinue}
        showBack={showBack}
      />
    </div>
  );
};

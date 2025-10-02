import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';
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

        {/* Optional Video Section */}
        <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center space-y-3 mb-6">
          <p className="text-muted-foreground text-center text-sm">
            Optional: Watch this video to learn more
          </p>
          <Button
            variant="outline"
            onClick={handleWatchVideo}
            size="sm"
            className="bg-background hover:bg-background/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Watch Video
          </Button>
        </div>

        {/* Sponsor Definition */}
        <div className="mb-6">
          <p className="text-foreground">
            Your sponsor is the person <span className="font-semibold">most influential</span> in your decision to join eXp Realty. They are not simply a mentor or team partner, unless that person was also most influential in your decision to join.
          </p>
        </div>

        {/* Key Points */}
        <div className="space-y-4">
          <ul className="space-y-3 list-disc pl-12 text-foreground">
            <li>
              Without a sponsor selection, eXp Realty becomes your permanent sponsor
            </li>
            <li>
              Sponsor selections are final and cannot be changed after submission
            </li>
            <li className="font-semibold">
              IF YOU ARE UNCERTAIN about your sponsor, DO NOT PROCEED until you're 100% sure
            </li>
          </ul>

          <div className="mt-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive">
                <span className="font-semibold">Irrevocable decision.</span> Choose carefully; if no sponsor is selected, eXp Realty will be assigned.
              </p>
            </div>
          </div>
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

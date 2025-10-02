import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Checkbox } from '@/components/ui/checkbox';

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

  const handleCheckboxChange = (checked: boolean) => {
    setAcknowledged(checked);
    onFormValidChange?.(checked);
  };

  const handleReadPolicy = () => {
    // Open policy document in new tab - replace with actual policy URL
    window.open('https://www.exprealty.com/sponsor-policy', '_blank');
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

        {/* Sponsor Definition */}
        <div className="mb-6">
          <p className="text-foreground">
            Your sponsor is the person <span className="font-semibold">most influential</span> in your decision to join eXp Realty. They are not simply a mentor or team partner, unless that person was also most influential in your decision to join.
          </p>
        </div>

        {/* Optional Video Section */}
        <div className="bg-muted rounded p-6 flex flex-col items-center justify-center space-y-3 mb-6 min-h-[200px] aspect-video max-w-xl mx-auto">
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

        {/* Key Points */}
        <div className="space-y-4">
          <ul className="space-y-3 list-disc pl-12 text-foreground">
            <li>
              Without a sponsor selection, eXp Realty will be assigned as your permanent sponsor.
            </li>
            <li>
              If you are uncertain about your sponsor, do not proceed until you are 100% sure.
            </li>
            <li className="font-semibold italic">
              Sponsor selections are final and cannot be changed after submission.
            </li>
          </ul>

        </div>

        {/* Acknowledgment Section */}
        <div className="mt-8 border border-border rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Checkbox 
              id="sponsor-policy" 
              checked={acknowledged}
              onCheckedChange={handleCheckboxChange}
            />
            <label 
              htmlFor="sponsor-policy" 
              className="text-foreground cursor-pointer select-none text-sm"
            >
              I have read and understood the sponsor policy.
            </label>
          </div>
          
          <button
            onClick={handleReadPolicy}
            className="text-foreground underline hover:no-underline mb-4 block"
          >
            Read the full policy
          </button>

          <div className="flex justify-end">
            <Button
              onClick={handleAcknowledge}
              disabled={!acknowledged}
              size="lg"
              className="w-auto"
            >
              I understand the sponsor policy
            </Button>
          </div>
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

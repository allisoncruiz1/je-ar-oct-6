import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Video, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
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
      <div className="space-y-4 flex-1 pb-24 md:pb-0">
        <div className="mb-4 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Understanding Your eXp Sponsor
          </h2>
        </div>

        {/* Video Player Section */}
        <Card className="border-2 shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <p className="text-foreground text-center font-medium">
              Click to watch 'Understanding your eXp Sponsor'
            </p>
            <Button
              onClick={handleWatchVideo}
              size="sm"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Watch Video
            </Button>
          </CardContent>
        </Card>

        {/* Sponsor Information */}
        <Card className="border-l-4 border-l-primary bg-card/50">
          <CardContent className="p-4 space-y-3">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground text-sm font-semibold">
                Your sponsor is the person MOST INFLUENTIAL in your decision to join eXp Realty. They are NOT simply a mentor or team partner, unless that person was also most influential in your decision to join.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  Without a sponsor selection, eXp Realty becomes your permanent sponsor
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  Sponsor selections are final and cannot be changed after submission
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Alert */}
        <Alert className="border-destructive/50 bg-destructive/5 py-3">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-foreground text-sm font-semibold ml-2">
            IF YOU ARE UNCERTAIN about your sponsor, DO NOT PROCEED until you're 100% sure. This is an irrevocable decision.
          </AlertDescription>
        </Alert>

        {/* Acknowledgment Button */}
        <Card className={acknowledged ? "border-primary bg-primary/5" : "border-2"}>
          <CardContent className="p-4 flex justify-center">
            <Button
              onClick={handleAcknowledge}
              disabled={acknowledged}
              size="lg"
              className="px-8 gap-2"
            >
              {acknowledged && <CheckCircle2 className="h-4 w-4" />}
              I understand the sponsor policy
            </Button>
          </CardContent>
        </Card>
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

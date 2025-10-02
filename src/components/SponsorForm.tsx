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
      <div className="space-y-6 flex-1 pb-24 md:pb-0">
        <div className="mb-6 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Understanding Your eXp Sponsor
          </h2>
        </div>

        {/* Video Player Section */}
        <Card className="border-2 shadow-md">
          <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[280px] space-y-5">
            <div className="rounded-full bg-primary/10 p-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <p className="text-foreground text-center text-lg font-medium">
              Click to watch 'Understanding your eXp Sponsor'
            </p>
            <Button
              onClick={handleWatchVideo}
              size="lg"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Watch Video
            </Button>
          </CardContent>
        </Card>

        {/* Sponsor Information */}
        <Card className="border-l-4 border-l-primary bg-card/50">
          <CardContent className="p-6 space-y-5">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground font-semibold leading-relaxed">
                Your sponsor is the person MOST INFLUENTIAL in your decision to join eXp Realty. They are NOT simply a mentor or team partner, unless that person was also most influential in your decision to join.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  Without a sponsor selection, eXp Realty becomes your permanent sponsor
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  Sponsor selections are final and cannot be changed after submission
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Alert */}
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-foreground font-semibold ml-2">
            IF YOU ARE UNCERTAIN about your sponsor, DO NOT PROCEED until you're 100% sure
          </AlertDescription>
        </Alert>

        <Alert className="border-2">
          <AlertDescription className="text-foreground font-medium">
            This is an irrevocable decision. Choose carefully or eXp Realty will be your sponsor.
          </AlertDescription>
        </Alert>

        {/* Acknowledgment Button */}
        <Card className={acknowledged ? "border-primary bg-primary/5" : "border-2"}>
          <CardContent className="p-6 flex justify-center">
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

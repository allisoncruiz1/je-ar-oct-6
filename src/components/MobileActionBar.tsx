import React from 'react';
import { Button } from '@/components/ui/button';

interface MobileActionBarProps {
  onBack?: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
  showBack?: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onBack, onContinue, canContinue = false, showBack = false }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-pb z-50">
      <div className="flex gap-3">
        {showBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
            aria-label="Go back to previous step"
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={showBack ? "flex-1" : "w-full"}
          aria-label="Continue to next step"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
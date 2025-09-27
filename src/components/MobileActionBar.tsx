import React from 'react';
import { Button } from '@/components/ui/button';

interface MobileActionBarProps {
  onSaveResume?: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onSaveResume, onContinue, canContinue = false }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-pb z-50">
      <div className="flex gap-3">
        <Button
          onClick={onSaveResume}
          variant="outline"
          className="flex-1"
          aria-label="Save and resume application later"
        >
          Save & Resume Later
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="flex-1"
          aria-label="Continue to next step"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';

interface MobileActionBarProps {
  onBack?: () => void;
  onContinue?: () => void;
  onSaveResume?: () => void;
  canContinue?: boolean;
  showBack?: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ 
  onBack, 
  onContinue, 
  onSaveResume,
  canContinue = false, 
  showBack = false 
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-pb z-50">
      <div className="flex items-center gap-2">
        {onSaveResume && (
          <button
            onClick={onSaveResume}
            className="text-sm text-primary hover:underline whitespace-nowrap"
            aria-label="Save and resume application later"
          >
            Save & Resume
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          {showBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="h-10"
              aria-label="Go back to previous step"
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            size="sm"
            className="h-10"
            aria-label="Continue to next step"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Mail } from 'lucide-react';

interface SaveResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (email: string) => void;
}

export const SaveResumeDialog: React.FC<SaveResumeDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSave = () => {
    if (isEmailValid && onSave) {
      onSave(email);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center">
              <Save className="h-6 w-6 text-brand-blue" />
            </div>
            <DialogTitle className="text-xl">Save Your Progress</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2">
            We'll save your application and send you a secure link to continue where you left off. You can return anytime within the next 30 days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="pl-10"
              />
            </div>
            {email && !isEmailValid && (
              <p className="text-sm text-destructive">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-sm mb-2">What happens next?</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-brand-blue mt-0.5">•</span>
                <span>Your progress will be securely saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue mt-0.5">•</span>
                <span>You'll receive an email with a unique link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue mt-0.5">•</span>
                <span>Click the link to continue your application</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue mt-0.5">•</span>
                <span>Your saved data expires after 30 days</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isEmailValid}
            className="flex-1"
          >
            Save & Send Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

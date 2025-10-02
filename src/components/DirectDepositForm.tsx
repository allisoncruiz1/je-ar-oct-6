import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileActionBar } from '@/components/MobileActionBar';

export interface DirectDepositData {
  bankName: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

interface DirectDepositFormProps {
  onSubmit?: (data: DirectDepositData) => void;
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
  initialData?: Partial<DirectDepositData>;
  onFormDataChange?: (data: DirectDepositData) => void;
}

export const DirectDepositForm: React.FC<DirectDepositFormProps> = ({
  onSubmit,
  onContinue,
  onSaveResume,
  onBack,
  onFormValidChange,
  canContinue,
  showBack,
  initialData,
  onFormDataChange
}) => {
  const [formData, setFormData] = useState<DirectDepositData>({
    bankName: initialData?.bankName || '',
    accountType: initialData?.accountType || '',
    routingNumber: initialData?.routingNumber || '',
    accountNumber: initialData?.accountNumber || '',
    confirmAccountNumber: initialData?.confirmAccountNumber || ''
  });

  const actionBarRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mobile, action bar on desktop
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        actionBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const updateFormData = (field: keyof DirectDepositData, value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onFormDataChange?.(newData);
  };

  const validateForm = () => {
    const isValid = 
      formData.bankName.trim() !== '' &&
      formData.accountType !== '' &&
      formData.routingNumber.trim() !== '' &&
      formData.accountNumber.trim() !== '' &&
      formData.confirmAccountNumber.trim() !== '' &&
      formData.accountNumber === formData.confirmAccountNumber;
    return isValid;
  };

  useEffect(() => {
    const isValid = validateForm();
    onFormValidChange(isValid);
  }, [formData]);

  return (
    <div className="space-y-8 md:pb-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Direct Deposit Information
          </h2>
          
          <p className="text-base text-[#1B489B] leading-relaxed mb-6">
            Please provide your banking information for commission deposits. This information will be securely stored and encrypted.
          </p>
        </div>

        {/* Bank Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank-name">
              Bank Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bank-name"
              placeholder="Enter your bank name"
              value={formData.bankName}
              onChange={(e) => updateFormData('bankName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-type">
              Account Type <span className="text-destructive">*</span>
            </Label>
            <select
              id="account-type"
              value={formData.accountType}
              onChange={(e) => updateFormData('accountType', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select account type</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="routing-number">
              Routing Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="routing-number"
              placeholder="9-digit routing number"
              value={formData.routingNumber}
              onChange={(e) => updateFormData('routingNumber', e.target.value)}
              maxLength={9}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">
              Account Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="account-number"
              type="password"
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData('accountNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-account-number">
              Confirm Account Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="confirm-account-number"
              type="password"
              placeholder="Re-enter your account number"
              value={formData.confirmAccountNumber}
              onChange={(e) => updateFormData('confirmAccountNumber', e.target.value)}
            />
            {formData.confirmAccountNumber && 
             formData.accountNumber !== formData.confirmAccountNumber && (
              <p className="text-sm text-destructive">Account numbers do not match</p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop action bar */}
      <div 
        ref={actionBarRef}
        className="hidden md:block sticky bottom-0 bg-background border-t border-border p-4 -mx-4 -mb-0 mt-8"
      >
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
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

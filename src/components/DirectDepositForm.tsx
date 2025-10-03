import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
export interface DirectDepositData {
  firstName: string;
  lastName: string;
  businessName: string;
  bankName: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  consentGiven: boolean;
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
  previousBankAccount?: {
    accountNumber: string;
    routingNumber: string;
  };
  continueButtonText?: string;
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
  onFormDataChange,
  previousBankAccount,
  continueButtonText = "Continue"
}) => {
  const [usePreviousAccount, setUsePreviousAccount] = useState<string>('');
  const [formData, setFormData] = useState<DirectDepositData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    businessName: initialData?.businessName || '',
    bankName: initialData?.bankName || '',
    accountType: initialData?.accountType || '',
    routingNumber: initialData?.routingNumber || '',
    accountNumber: initialData?.accountNumber || '',
    confirmAccountNumber: initialData?.confirmAccountNumber || '',
    consentGiven: initialData?.consentGiven || false
  });
  const actionBarRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mobile, action bar on desktop
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        actionBarRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Pre-fill routing and account number when using previous account
  useEffect(() => {
    if (usePreviousAccount === 'previous' && previousBankAccount) {
      updateFormData('routingNumber', previousBankAccount.routingNumber);
      updateFormData('accountNumber', previousBankAccount.accountNumber);
      updateFormData('confirmAccountNumber', previousBankAccount.accountNumber);
    }
  }, [usePreviousAccount, previousBankAccount]);
  const updateFormData = (field: keyof DirectDepositData, value: string | boolean) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onFormDataChange?.(newData);
  };
  const validateForm = () => {
    // Check name fields based on account type
    const hasValidName = formData.accountType === 'business' ? formData.businessName.trim() !== '' : formData.accountType === 'personal' ? formData.firstName.trim() !== '' && formData.lastName.trim() !== '' : false;

    // If using previous account, validate name fields, bank name, account type, and consent
    if (usePreviousAccount === 'previous' && previousBankAccount) {
      return hasValidName && formData.bankName.trim() !== '' && formData.accountType !== '' && formData.consentGiven;
    }

    // If providing different details, validate all fields including consent
    if (usePreviousAccount === 'different') {
      const isValid = hasValidName && formData.bankName.trim() !== '' && formData.accountType !== '' && formData.routingNumber.trim() !== '' && formData.accountNumber.trim() !== '' && formData.confirmAccountNumber.trim() !== '' && formData.accountNumber === formData.confirmAccountNumber && formData.consentGiven;
      return isValid;
    }
    return false;
  };
  useEffect(() => {
    const isValid = validateForm();
    onFormValidChange(isValid);
  }, [formData, usePreviousAccount]);
  return <div className="space-y-8 md:pb-0 pt-6 md:pt-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Direct Deposit Information
          </h2>
          
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Please provide your banking information for commission deposits. This information will be securely stored and encrypted.
          </p>
        </div>

        {/* Reuse Previous Bank Account Section */}
        {previousBankAccount && <div className="space-y-4 pt-4 border-t border-border">
            <Label className="text-base font-semibold text-foreground">
              You've already provided bank details earlier. Would you like to use the same account for receiving payments, or enter new details?
              <span className="text-destructive ml-1">*</span>
            </Label>
            
            <RadioGroup value={usePreviousAccount} onValueChange={setUsePreviousAccount} className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg md:bg-transparent md:p-0">
                <RadioGroupItem value="previous" id="use-previous" className="h-5 w-5 mt-0.5" />
                <Label htmlFor="use-previous" className="flex-1 cursor-pointer">
                  <div className="text-base text-foreground font-normal">
                    Apply previously provided bank details
                  </div>
                  {usePreviousAccount === 'previous' && <div className="mt-3 p-4 bg-muted rounded-lg border border-border">
                      <p className="font-medium text-foreground mb-1">Previously mentioned Bank Account</p>
                      <p className="text-sm text-muted-foreground">**** **** **** {previousBankAccount.accountNumber}</p>
                    </div>}
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg md:bg-transparent md:p-0">
                <RadioGroupItem value="different" id="use-different" className="h-5 w-5" />
                <Label htmlFor="use-different" className="text-base text-foreground cursor-pointer">
                  Provide different bank details
                </Label>
              </div>
            </RadioGroup>
          </div>}

        {/* Bank Information - Show for both previous (partial) and different (full) */}
        {(usePreviousAccount === 'previous' || usePreviousAccount === 'different' || !previousBankAccount) && <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="font-semibold text-base flex items-center gap-2">
                What type of bank account should we use to deposit your commissions? <span className="text-destructive">*</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button" className="inline-flex">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Please make sure the bank account you enter here matches the information on your W-9. eXp uses this same account for your commission payments and for IRS reporting, so consistency helps avoid delays or tax issues.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <RadioGroup value={formData.accountType} onValueChange={value => updateFormData('accountType', value)} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg md:bg-transparent md:p-0">
                  <RadioGroupItem value="personal" id="account-personal" className="h-5 w-5" />
                  <Label htmlFor="account-personal" className="text-base text-foreground cursor-pointer">
                    Personal/Individual Account
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg md:bg-transparent md:p-0">
                  <RadioGroupItem value="business" id="account-business" className="h-5 w-5" />
                  <Label htmlFor="account-business" className="text-base text-foreground cursor-pointer">
                    Business Account
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.accountType === 'business' ? <div className="space-y-2">
                <Label htmlFor="business-name">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input id="business-name" placeholder="Enter business name" value={formData.businessName} onChange={e => updateFormData('businessName', e.target.value)} />
              </div> : formData.accountType === 'personal' ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">
                    First Name on Account <span className="text-destructive">*</span>
                  </Label>
                  <Input id="first-name" placeholder="Enter first name" value={formData.firstName} onChange={e => updateFormData('firstName', e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last-name">
                    Last Name on Account <span className="text-destructive">*</span>
                  </Label>
                  <Input id="last-name" placeholder="Enter last name" value={formData.lastName} onChange={e => updateFormData('lastName', e.target.value)} />
                </div>
              </div> : null}

            <div className="space-y-2">
              <Label htmlFor="bank-name">
                Bank Name <span className="text-destructive">*</span>
              </Label>
              <Input id="bank-name" placeholder="Enter your bank name" value={formData.bankName} onChange={e => updateFormData('bankName', e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routing-number">
                Routing Number <span className="text-destructive">*</span>
              </Label>
              <Input id="routing-number" placeholder="9-digit routing number" value={formData.routingNumber} onChange={e => updateFormData('routingNumber', e.target.value)} maxLength={9} disabled={usePreviousAccount === 'previous'} className={usePreviousAccount === 'previous' ? 'bg-muted cursor-not-allowed' : ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">
                Account Number <span className="text-destructive">*</span>
              </Label>
              <Input id="account-number" type="password" placeholder="Enter your account number" value={formData.accountNumber} onChange={e => updateFormData('accountNumber', e.target.value)} disabled={usePreviousAccount === 'previous'} className={usePreviousAccount === 'previous' ? 'bg-muted cursor-not-allowed' : ''} />
            </div>

            {usePreviousAccount !== 'previous' && <div className="space-y-2">
                <Label htmlFor="confirm-account-number">
                  Confirm Account Number <span className="text-destructive">*</span>
                </Label>
                <Input id="confirm-account-number" type="password" placeholder="Re-enter your account number" value={formData.confirmAccountNumber} onChange={e => updateFormData('confirmAccountNumber', e.target.value)} />
                {formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber && <p className="text-sm text-destructive">Account numbers do not match</p>}
              </div>}
          </div>}

        {/* Consent Checkbox */}
        {(usePreviousAccount === 'previous' || usePreviousAccount === 'different' || !previousBankAccount) && (
          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border">
            <Checkbox 
              id="consent" 
              checked={formData.consentGiven}
              onCheckedChange={(checked) => updateFormData('consentGiven', checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer flex-1">
              By clicking the "checkbox", you instruct the eXp World Holdings, Inc. family of companies (collectively, "eXp") to deliver any and all payments that you are entitled to receive from eXp (such as, for example only, real estate commissions, revenue share payments, and applicable reimbursements) to that depository account that you initially designate, immediately below, and that you subsequently update from time to time within the MY EXP® platform (whether accessed through the MY EXP® app. or on the web at{' '}
              <a href="https://my.exprealty.com/login" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://my.exprealty.com/login
              </a>)
              <span className="text-destructive ml-1">*</span>
            </Label>
          </div>
        )}
      </div>

      {/* Desktop action bar */}
      <div ref={actionBarRef} className="hidden md:block sticky bottom-0 bg-background border-t border-border p-4 -mx-4 -mb-0 mt-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onSaveResume} aria-label="Save and resume application later">
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            {showBack && <Button variant="ghost" size="sm" onClick={onBack} aria-label="Go back to previous step">
                Back
              </Button>}
            <Button type="button" size="sm" onClick={onContinue} disabled={!canContinue} aria-label="Continue to next step">
              {continueButtonText}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <MobileActionBar onBack={onBack} onContinue={onContinue} onSaveResume={onSaveResume} canContinue={canContinue} showBack={showBack} continueButtonText={continueButtonText} />
    </div>;
};
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Plus } from 'lucide-react';

export interface PaymentInfoData {
  thirdPartyPayment: string;
  paymentMethods: Array<{
    id: string;
    type: string;
    details: any;
  }>;
}

interface PaymentInfoFormProps {
  onSubmit?: (data: PaymentInfoData) => void;
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
  initialData?: Partial<PaymentInfoData>;
  onFormDataChange?: (data: PaymentInfoData) => void;
}

export const PaymentInfoForm: React.FC<PaymentInfoFormProps> = ({
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
  const [formData, setFormData] = useState<PaymentInfoData>({
    thirdPartyPayment: initialData?.thirdPartyPayment || '',
    paymentMethods: initialData?.paymentMethods || []
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

  const updateFormData = (field: keyof PaymentInfoData, value: any) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onFormDataChange?.(newData);
  };

  const validateForm = () => {
    // Form is valid if third party payment is selected and has at least 2 payment methods
    const isValid = 
      formData.thirdPartyPayment !== '' && 
      formData.paymentMethods.length >= 2;
    return isValid;
  };

  useEffect(() => {
    const isValid = validateForm();
    onFormValidChange(isValid);
  }, [formData]);

  const handleAddPaymentMethod = () => {
    // This will be implemented with a dialog/modal for payment method entry
    console.log('Add payment method clicked');
    // For now, just add a placeholder
    const newMethod = {
      id: `payment-${Date.now()}`,
      type: 'credit-card',
      details: {}
    };
    updateFormData('paymentMethods', [...formData.paymentMethods, newMethod]);
  };

  return (
    <div className="space-y-8 md:pb-0">
      {/* Monthly Fee Collection Setup */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Monthly Fee Collection Setup
          </h2>
          
          <div className="space-y-4 text-[#1B489B]">
            <p className="text-base leading-relaxed">
              Every joining agent is required to have 2 forms of payment on file. Initial fee is charged after onboarding has been completed.
            </p>
            
            <div className="space-y-2">
              <p className="font-semibold text-base">Fee Structure:</p>
              <p className="text-base">
                <span className="font-semibold">Initial Fee:</span> $149
              </p>
              <p className="text-base">
                <span className="font-semibold">Ongoing Monthly Fee:</span> $85
              </p>
            </div>
          </div>
        </div>

        {/* Third Party Payment Question */}
        <div className="space-y-4 pt-4 border-t border-border">
          <Label className="text-base font-semibold text-foreground">
            Will someone else be paying your signup and monthly cloud brokerage fee on your behalf?
            <span className="text-destructive ml-1">*</span>
          </Label>
          
          <RadioGroup 
            value={formData.thirdPartyPayment} 
            onValueChange={(value) => updateFormData('thirdPartyPayment', value)}
            className="flex flex-col gap-3 md:flex-row md:gap-6"
          >
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="yes" id="third-party-yes" className="h-5 w-5" />
              <Label 
                htmlFor="third-party-yes" 
                className="text-base md:text-sm text-foreground cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="no" id="third-party-no" className="h-5 w-5" />
              <Label 
                htmlFor="third-party-no" 
                className="text-base md:text-sm text-foreground cursor-pointer"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Payment Details Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Payment Details
            </h3>
            
            <div className="space-y-3 text-[#1B489B]">
              <p className="text-base leading-relaxed">
                Please add 2 forms of your personal payment details.
              </p>
              <p className="text-base leading-relaxed">
                Even if a third party is covering your fees, we require a backup account.
              </p>
              <p className="text-base leading-relaxed">
                Don't worry—we won't charge you until your onboarding is complete.
              </p>
            </div>
          </div>

          {/* Payment Methods List */}
          {formData.paymentMethods.length > 0 && (
            <div className="space-y-3">
              {formData.paymentMethods.map((method, index) => (
                <div 
                  key={method.id}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Payment Method {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {method.type}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newMethods = formData.paymentMethods.filter(m => m.id !== method.id);
                        updateFormData('paymentMethods', newMethods);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Payment Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleAddPaymentMethod}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Payment Details
          </Button>
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

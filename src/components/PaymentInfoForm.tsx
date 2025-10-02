import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { MobileActionBar } from '@/components/MobileActionBar';
import { PaymentDetailsDialog } from '@/components/PaymentDetailsDialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
export interface PaymentInfoData {
  thirdPartyPayment: string;
  payerName?: string;
  payerEmail?: string;
  paymentMethods: Array<{
    id: string;
    type: string;
    details: any;
    isDefault?: boolean;
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
    payerName: initialData?.payerName || '',
    payerEmail: initialData?.payerEmail || '',
    paymentMethods: initialData?.paymentMethods || []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
  const updateFormData = (field: keyof PaymentInfoData, value: any) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onFormDataChange?.(newData);
  };
  const validateForm = () => {
    // If third party payment is yes, check for payer name and email
    if (formData.thirdPartyPayment === 'yes') {
      const hasPayerInfo = formData.payerName && formData.payerName.trim() !== '' && 
                           formData.payerEmail && formData.payerEmail.trim() !== '';
      return hasPayerInfo && formData.paymentMethods.length >= 2;
    }
    // Otherwise just check third party payment selection and payment methods
    const isValid = formData.thirdPartyPayment !== '' && formData.paymentMethods.length >= 2;
    return isValid;
  };
  useEffect(() => {
    const isValid = validateForm();
    onFormValidChange(isValid);
  }, [formData]);
  const handleAddPaymentMethod = (paymentData: any) => {
    // Handle both single payment and array of payments
    if (Array.isArray(paymentData)) {
      // Adding multiple payments at once
      updateFormData('paymentMethods', [...formData.paymentMethods, ...paymentData]);
      
      // Show success toast
      toast({
        title: "Payment methods added successfully",
        description: "Your payment details have been saved.",
      });
    } else {
      // Adding single payment
      const newMethod = {
        id: paymentData.id,
        type: paymentData.type,
        details: paymentData.details,
        isDefault: paymentData.isDefault || false
      };
      updateFormData('paymentMethods', [...formData.paymentMethods, newMethod]);
      
      // Show success toast
      toast({
        title: "Payment method added successfully",
        description: "Your payment details have been saved.",
      });
    }
  };
  return <div className="space-y-8 md:pb-0">
      {/* Page Title */}
      <div className="mb-6 mt-8 max-md:mt-2">
        <h1 className="font-semibold text-foreground text-xl">
          Payment Info
        </h1>
      </div>

      {/* Monthly Fee Collection Setup */}
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-foreground mb-4 text-lg">
            Monthly Fee Collection Setup
          </h2>
          
          <div className="space-y-4 text-muted-foreground">
            <p className="text-base leading-relaxed">
              Every joining agent is required to have 2 forms of payment on file. Initial fee is charged after onboarding has been completed.
            </p>
            
            <div className="space-y-1 p-4 rounded-lg border-l-4 border-[hsl(var(--brand-blue))] bg-[hsl(var(--brand-blue))]/5">
              <p className="font-semibold text-[hsl(var(--brand-blue))] text-base">Fee Structure:</p>
              <p className="text-base">
                <span className="font-semibold text-foreground">Initial Fee:</span> $149
              </p>
              <p className="text-base">
                <span className="font-semibold text-foreground">Ongoing Monthly Fee:</span> $85
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
          
          <RadioGroup value={formData.thirdPartyPayment} onValueChange={value => updateFormData('thirdPartyPayment', value)} className="flex flex-col gap-3 md:flex-row md:gap-6">
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="yes" id="third-party-yes" className="h-5 w-5" />
              <Label htmlFor="third-party-yes" className="text-base md:text-sm text-foreground cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="no" id="third-party-no" className="h-5 w-5" />
              <Label htmlFor="third-party-no" className="text-base md:text-sm text-foreground cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>

          {/* Third Party Payer Details - Only show when "yes" is selected */}
          {formData.thirdPartyPayment === 'yes' && (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="payer-name" className="text-base font-semibold text-foreground">
                  Who is responsible for paying your fees?
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="payer-name"
                  type="text"
                  placeholder="Enter the full name of the person who will be handling your payments"
                  value={formData.payerName || ''}
                  onChange={(e) => updateFormData('payerName', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payer-email" className="text-base font-semibold text-foreground">
                  Email of the person paying your fees?
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="payer-email"
                  type="email"
                  placeholder="Provide the email address where we can reach the payer for payment setup and details"
                  value={formData.payerEmail || ''}
                  onChange={(e) => updateFormData('payerEmail', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Details Section */}
        <div className="space-y-4 pt-6 border-t border-border">
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-lg">
              Payment Details
            </h3>
            
            <div className="text-muted-foreground">
              <p className="text-base leading-relaxed">
                Please add 2 forms of your personal payment details. Even if a third party is covering your fees, we require a backup account. Don't worry—we won't charge you until your onboarding is complete.
              </p>
            </div>
          </div>

          {/* Payment Methods List */}
          {formData.paymentMethods.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Credit Card */}
                {formData.paymentMethods.find(m => m.type === 'credit-card') && (
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-3">
                      Credit Card Details<span className="text-destructive">*</span>
                    </h4>
                    <div className="p-6 border-2 border-border rounded-2xl bg-background">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center bg-white">
                          <span className="text-[#1434CB] font-bold text-xl" style={{ fontFamily: 'serif' }}>VISA</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-lg mb-1">Credit card</p>
                          <p className="text-base text-foreground">
                            **** **** **** {formData.paymentMethods.find(m => m.type === 'credit-card')?.details.cardNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Account */}
                {formData.paymentMethods.find(m => m.type === 'bank-account') && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-foreground text-lg">
                        Bank Account Details<span className="text-destructive">*</span>
                      </h4>
                      {formData.paymentMethods.find(m => m.type === 'bank-account')?.isDefault && (
                        <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-sm font-normal">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="p-6 border-2 border-border rounded-2xl bg-background">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#2C3E50] flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">capital</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-lg mb-1">Capital Bank - Checking</p>
                          <p className="text-base text-foreground">
                            *****{formData.paymentMethods.find(m => m.type === 'bank-account')?.details.accountNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {formData.paymentMethods.length === 2 && (
                <p className="text-base text-foreground">
                  Note: You can update your payment details anytime after submitting your application in your My eXp account.
                </p>
              )}
            </div>
          )}

          {/* Add Payment Button - Only show if less than 2 payment methods */}
          {formData.paymentMethods.length < 2 && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setIsDialogOpen(true)} 
              className="w-full md:w-auto border-[hsl(var(--brand-blue))] text-[hsl(var(--brand-blue))] hover:bg-[hsl(var(--brand-blue))]/10"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Payment Details
            </Button>
          )}
        </div>
      </div>

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddPayment={handleAddPaymentMethod}
        existingPayments={formData.paymentMethods}
      />

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
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <MobileActionBar onBack={onBack} onContinue={onContinue} onSaveResume={onSaveResume} canContinue={canContinue} showBack={showBack} />
    </div>;
};
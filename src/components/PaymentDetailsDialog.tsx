import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (paymentData: any) => void;
  existingPayments?: Array<{
    id: string;
    type: string;
    details: any;
  }>;
}

export const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
  onAddPayment,
  existingPayments = [],
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('credit-card');
  const [showCVV, setShowCVV] = useState(false);
  const [addedPayments, setAddedPayments] = useState<Array<any>>([]);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string>('');

  // Credit Card Form State
  const [billingName, setBillingName] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingZip, setBillingZip] = useState('');

  // Bank Account Form State
  const [accountHolderName, setAccountHolderName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');

  // Validation State
  const [cardValidationAttempts, setCardValidationAttempts] = useState(0);
  const [bankValidationAttempts, setBankValidationAttempts] = useState(0);
  const [cardValidationError, setCardValidationError] = useState(false);
  const [bankValidationError, setBankValidationError] = useState(false);
  const [showCardConfirmation, setShowCardConfirmation] = useState(false);
  const [showBankConfirmation, setShowBankConfirmation] = useState(false);
  const [savedCardData, setSavedCardData] = useState<any>(null);
  const [savedBankData, setSavedBankData] = useState<any>(null);
  
  // Field visibility state (for Option B)
  const [showCardFields, setShowCardFields] = useState(true);
  const [showBankFields, setShowBankFields] = useState(true);
  
  // Field-level validation errors
  const [routingNumberError, setRoutingNumberError] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');

  // Mock validation function - simulates payment processor validation
  // Triggers failure when name is "Allison Smith"
  const validatePaymentDetails = (name: string): boolean => {
    // For demo purposes, "Allison Smith" will trigger validation failures
    // In production, this would call a real payment processor API
    return name.toLowerCase().trim() !== "allison smith";
  };

  const handleAddCard = () => {
    const isValid = validatePaymentDetails(cardholderName);
    
    if (!isValid) {
      setCardValidationAttempts(prev => prev + 1);
      setCardValidationError(true);
      setShowCardFields(false); // Hide fields on validation error
      
      // Save the card data for potential confirmation
      setSavedCardData({
        billingName,
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        billingZip,
      });

      // After 3 attempts, show confirmation screen
      if (cardValidationAttempts + 1 >= 3) {
        setShowCardConfirmation(true);
      }
      return;
    }

    // Validation successful
    const paymentData = {
      id: `payment-${Date.now()}`,
      type: 'credit-card',
      details: {
        billingName,
        cardholderName,
        cardNumber: cardNumber.slice(-4),
        expiryDate,
        billingZip,
      },
      validated: true,
      attemptCount: cardValidationAttempts,
      bypassedValidation: false,
    };
    setAddedPayments([...addedPayments, paymentData]);
    resetCardForm();
    setActiveTab('bank-account');
  };

  const handleConfirmCardAndContinue = () => {
    const paymentData = {
      id: `payment-${Date.now()}`,
      type: 'credit-card',
      details: {
        billingName: savedCardData.billingName,
        cardholderName: savedCardData.cardholderName,
        cardNumber: savedCardData.cardNumber.slice(-4),
        expiryDate: savedCardData.expiryDate,
        billingZip: savedCardData.billingZip,
      },
      validated: false,
      attemptCount: cardValidationAttempts,
      bypassedValidation: true,
    };
    setAddedPayments([...addedPayments, paymentData]);
    resetCardForm();
    setActiveTab('bank-account');
  };

  const handleUpdateCardDetails = () => {
    setCardValidationError(false);
    setShowCardFields(true); // Show fields when user wants to update
  };

  const resetCardForm = () => {
    setBillingName('');
    setCardholderName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setBillingZip('');
    setCardValidationAttempts(0);
    setCardValidationError(false);
    setShowCardConfirmation(false);
    setSavedCardData(null);
    setShowCardFields(true); // Reset field visibility
  };

  const handleAddBankAccount = () => {
    const isValid = validatePaymentDetails(accountHolderName);
    
    if (!isValid) {
      setBankValidationAttempts(prev => prev + 1);
      setBankValidationError(true);
      setShowBankFields(false); // Hide fields on validation error
      
      setSavedBankData({
        routingNumber,
        accountNumber,
      });

      if (bankValidationAttempts + 1 >= 3) {
        setShowBankConfirmation(true);
      }
      return;
    }

    // Validation successful
    const paymentData = {
      id: `payment-${Date.now()}`,
      type: 'bank-account',
      details: {
        routingNumber,
        accountNumber: accountNumber.slice(-4),
      },
      validated: true,
      attemptCount: bankValidationAttempts,
      bypassedValidation: false,
    };
    setAddedPayments([...addedPayments, paymentData]);
    resetBankForm();
    setActiveTab('default-method');
  };

  const handleConfirmBankAndContinue = () => {
    const paymentData = {
      id: `payment-${Date.now()}`,
      type: 'bank-account',
      details: {
        routingNumber: savedBankData.routingNumber,
        accountNumber: savedBankData.accountNumber.slice(-4),
      },
      validated: false,
      attemptCount: bankValidationAttempts,
      bypassedValidation: true,
    };
    setAddedPayments([...addedPayments, paymentData]);
    resetBankForm();
    setActiveTab('default-method');
  };

  const handleUpdateBankDetails = () => {
    setBankValidationError(false);
    setShowBankFields(true); // Show fields when user wants to update
  };

  const resetBankForm = () => {
    setRoutingNumber('');
    setAccountNumber('');
    setBankValidationAttempts(0);
    setBankValidationError(false);
    setShowBankConfirmation(false);
    setSavedBankData(null);
    setShowBankFields(true); // Reset field visibility
    setRoutingNumberError('');
    setAccountNumberError('');
  };

  const handleSaveDefault = () => {
    // Save all added payments at once to avoid state update race conditions
    const allNewPayments = addedPayments.map(payment => ({
      id: payment.id,
      type: payment.type,
      details: payment.details,
      isDefault: payment.id === defaultPaymentId
    }));
    
    // Pass all payments at once
    onAddPayment(allNewPayments);
    
    setAddedPayments([]);
    setDefaultPaymentId('');
    setActiveTab('credit-card');
    onOpenChange(false);
  };

  const resetForm = () => {
    resetCardForm();
    resetBankForm();
    setAccountHolderName('');
    setAccountType('');
  };

  const allPayments = [...existingPayments, ...addedPayments];

  const getPaymentDisplayName = (payment: any) => {
    if (payment.type === 'credit-card') {
      return 'Capital Credit Card';
    } else {
      return 'Capital Bank- Checking';
    }
  };

  const getPaymentMaskedNumber = (payment: any) => {
    if (payment.type === 'credit-card') {
      return `**** **** **** ${payment.details.cardNumber}`;
    } else {
      return `**** **** **** ${payment.details.accountNumber}`;
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 6);
    }
    return cleaned;
  };

  // Shared form content
  const formContent = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-3 gap-1">
        <TabsTrigger 
          value="credit-card" 
          className="flex-1 text-xs sm:text-sm px-2 min-h-[40px] rounded-md data-[state=active]:shadow-none"
        >
          {isMobile ? '1. Card' : '1. Add Credit Card'}
        </TabsTrigger>
        <TabsTrigger 
          value="bank-account" 
          className="flex-1 text-xs sm:text-sm px-2 min-h-[40px] rounded-md data-[state=active]:shadow-none"
        >
          {isMobile ? '2. Bank' : '2. Add Bank Account'}
        </TabsTrigger>
        <TabsTrigger 
          value="default-method" 
          className="flex-1 text-xs sm:text-sm px-2 min-h-[40px] rounded-md data-[state=active]:shadow-none" 
        >
          {isMobile ? '3. Default' : '3. Set Default Method'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="credit-card" className="space-y-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-semibold mb-0.5">Add Credit Card</h3>
          <p className="text-[hsl(var(--brand-blue))] text-xs">
            Add your credit card information for secure payment processing.
          </p>
        </div>

        {cardValidationError && !showCardConfirmation && (
          <Alert className="border-l-4 border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/20 shadow-sm py-2.5">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <AlertDescription className="text-amber-900 dark:text-amber-100">
                  <p className="font-semibold text-sm mb-0.5">
                    We weren't able to validate these details
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mb-1.5">
                    Please double-check your entry. You can:
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Card number does not match with other details (Attempt {cardValidationAttempts}/3)
                  </p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {showCardConfirmation && (
          <Alert className="border-l-4 border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/20 shadow-sm">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <AlertDescription className="text-amber-900 dark:text-amber-100">
                  <p className="font-semibold text-base mb-2">
                    We weren't able to validate these details after 3 attempts
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                    We'll go ahead and move you forward with the information you provided, and our staff will follow up if needed.
                  </p>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-amber-200 dark:border-amber-800/50 shadow-sm mb-4">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Entered Details</h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Billing Name:</span>
                        <span className="font-medium text-foreground">{savedCardData?.billingName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Cardholder Name:</span>
                        <span className="font-medium text-foreground">{savedCardData?.cardholderName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Card Number:</span>
                        <span className="font-medium font-mono text-foreground">**** **** **** {savedCardData?.cardNumber.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Expiry Date:</span>
                        <span className="font-medium text-foreground">{savedCardData?.expiryDate}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">CVV:</span>
                        <span className="font-medium font-mono text-foreground">***</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Billing ZIP:</span>
                        <span className="font-medium text-foreground">{savedCardData?.billingZip}</span>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {!showCardConfirmation && showCardFields && (
          <>
            <div className="space-y-2.5">
              <div className="space-y-1">
                <Label htmlFor="billing-name">
                  Billing Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="billing-name"
                  placeholder="Full billing name"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cardholder-name">
                  Cardholder Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cardholder-name"
                  placeholder="Full name on card"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="card-number">
                  Card Number<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="card-number"
                  placeholder="1234 5647 2627 8901"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="expiry-date">
                    Expiry Date<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="expiry-date"
                    placeholder="MM/YYYY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={7}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cvv">
                    CVV<span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="cvv"
                      type={showCVV ? 'text' : 'password'}
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      className="pr-9 h-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCVV(!showCVV)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-2 -m-2"
                    >
                      {showCVV ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="billing-zip">
                  Billing ZIP Code<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="billing-zip"
                  placeholder="12345"
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                  className="h-9"
                />
              </div>
            </div>

            {cardValidationError ? (
            <div className="hidden md:flex flex-col sm:flex-row gap-2.5">
                <Button
                  size="lg"
                  onClick={handleUpdateCardDetails}
                  className="flex-1 min-h-[48px]"
                >
                  Update Card Details
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleConfirmCardAndContinue}
                  className="flex-1 min-h-[48px]"
                >
                  Confirm and Continue
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddCard}
                disabled={!billingName || !cardholderName || !cardNumber || !expiryDate || !cvv || !billingZip}
                className="w-full min-h-[48px] hidden md:block"
                size="lg"
              >
                Add Card
              </Button>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="bank-account" className="space-y-3">
        <div>
          <h3 className="text-sm sm:text-base font-semibold mb-0.5">Add Bank Account</h3>
          <p className="text-[hsl(var(--brand-blue))] text-xs">
            Add your bank account information for secure ACH transfers.
          </p>
        </div>

        {bankValidationError && !showBankConfirmation && (
          <Alert className="border-l-4 border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/20 shadow-sm py-2.5">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <AlertDescription className="text-amber-900 dark:text-amber-100">
                  <p className="font-semibold text-sm mb-0.5">
                    We weren't able to validate these details
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mb-1.5">
                    Please double-check your entry. You can:
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Account number does not match with routing number (Attempt {bankValidationAttempts}/3)
                  </p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {showBankConfirmation && (
          <Alert className="border-amber-600 bg-amber-50 dark:bg-amber-950/30">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900 dark:text-amber-200">
              <p className="font-medium mb-3">
                We weren't able to validate these details after 3 attempts. We'll go ahead and move you forward with the information you provided, and our staff will follow up if needed.
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-amber-200 dark:border-amber-800 space-y-2">
                <h4 className="font-semibold text-sm mb-2">Entered Details</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routing Number:</span>
                    <span className="font-medium">{savedBankData?.routingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">**** **** **** {savedBankData?.accountNumber.slice(-4)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleConfirmBankAndContinue}
                className="w-full mt-4"
                size="sm"
              >
                Next
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!showBankConfirmation && showBankFields && (
          <>
          <div className="space-y-2.5">
            <div className="space-y-1">
            <Label htmlFor="routing-number">
              Routing Number<span className="text-destructive">*</span>
            </Label>
            <Input
              id="routing-number"
              placeholder="9-digit routing number"
              value={routingNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                setRoutingNumber(value);
                if (value.length > 0 && value.length < 8) {
                  setRoutingNumberError('Routing number must be at least 8 digits');
                } else {
                  setRoutingNumberError('');
                }
              }}
              maxLength={9}
              className={`h-9 ${routingNumberError ? 'border-destructive' : ''}`}
            />
            {routingNumberError ? (
              <p className="text-xs text-destructive">{routingNumberError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Must be a minimum of 8 digits</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="account-number">
              Account Number<span className="text-destructive">*</span>
            </Label>
            <Input
              id="account-number"
              placeholder="5657 8858 3733 3383"
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setAccountNumber(value);
                if (value.length > 0 && value.length < 6) {
                  setAccountNumberError('Account number must be at least 6 digits');
                } else {
                  setAccountNumberError('');
                }
              }}
              className={`h-9 ${accountNumberError ? 'border-destructive' : ''}`}
            />
            {accountNumberError ? (
              <p className="text-xs text-destructive">{accountNumberError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Must be at least 6 digits</p>
            )}
          </div>
        </div>

        {bankValidationError && !showBankConfirmation ? (
          <div className="hidden md:flex flex-col sm:flex-row gap-2.5">
            <Button
              size="lg"
              onClick={handleUpdateBankDetails}
              className="flex-1 min-h-[48px]"
            >
              Update Bank Details
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleConfirmBankAndContinue}
              className="flex-1 min-h-[48px]"
            >
              Confirm and Continue
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddBankAccount}
            disabled={!routingNumber || routingNumber.length < 8 || !accountNumber || accountNumber.length < 6}
            className="w-full min-h-[48px] hidden md:block"
            size="lg"
          >
            Add Bank Account
          </Button>
        )}
          </>
        )}
      </TabsContent>

      <TabsContent value="default-method" className="space-y-3">
        <div>
          <p className="text-[hsl(var(--brand-blue))] text-sm leading-relaxed">
            Your default payment method is used for all payment types where you haven't chosen a different payment method.
          </p>
        </div>

        <RadioGroup value={defaultPaymentId} onValueChange={setDefaultPaymentId} className="space-y-3">
          {allPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors min-h-[60px]"
            >
              <RadioGroupItem value={payment.id} id={payment.id} className="h-5 w-5" />
              <Label htmlFor={payment.id} className="flex-1 cursor-pointer">
                <div className="font-semibold text-foreground">
                  {getPaymentDisplayName(payment)}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {getPaymentMaskedNumber(payment)}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleSaveDefault}
          disabled={!defaultPaymentId}
          className="w-full min-h-[48px]"
          size="lg"
        >
          Save
        </Button>
      </TabsContent>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="text-left flex-shrink-0">
            <DrawerTitle className="text-xl font-semibold">Add Payment Details</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 overflow-auto px-4 pb-24">
            {formContent}
          </ScrollArea>

          {/* Mobile sticky action bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
            {activeTab === 'credit-card' && !showCardConfirmation && (
              cardValidationError ? (
                <div className="flex gap-2">
                  <Button size="lg" className="flex-1 text-xs px-4 py-3" onClick={handleUpdateCardDetails}>
                    Update Card Details
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 text-xs px-4 py-3" onClick={handleConfirmCardAndContinue}>
                    Confirm and Continue
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddCard}
                  disabled={!billingName || !cardholderName || !cardNumber || !expiryDate || !cvv || !billingZip}
                >
                  Add Card
                </Button>
              )
            )}

            {activeTab === 'bank-account' && !showBankConfirmation && (
              bankValidationError ? (
                <div className="flex gap-2">
                  <Button size="lg" className="flex-1 text-xs px-4 py-3" onClick={handleUpdateBankDetails}>
                    Update Bank Details
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 text-xs px-4 py-3" onClick={handleConfirmBankAndContinue}>
                    Confirm and Continue
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddBankAccount}
                  disabled={!routingNumber || routingNumber.length < 8 || !accountNumber || accountNumber.length < 6}
                >
                  Add Bank Account
                </Button>
              )
            )}

            {activeTab === 'credit-card' && showCardConfirmation && (
              <Button size="lg" className="w-full" onClick={handleConfirmCardAndContinue}>
                Next
              </Button>
            )}
            {activeTab === 'bank-account' && showBankConfirmation && (
              <Button size="lg" className="w-full" onClick={handleConfirmBankAndContinue}>
                Next
              </Button>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Payment Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {formContent}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

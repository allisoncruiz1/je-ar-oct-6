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
import { Eye, EyeOff } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('bank-account');
  const [showCVV, setShowCVV] = useState(false);
  const [addedPayments, setAddedPayments] = useState<Array<any>>([]);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string>('');

  // Credit Card Form State
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

  const handleAddBankAccount = () => {
    const paymentData = {
      id: `payment-${Date.now()}`,
      type: 'bank-account',
      details: {
        routingNumber,
        accountNumber: accountNumber.slice(-4), // Only store last 4 digits
      },
    };
    setAddedPayments([...addedPayments, paymentData]);
    // Reset bank account form
    setRoutingNumber('');
    setAccountNumber('');
    // Switch to credit card tab
    setActiveTab('credit-card');
  };

  const handleAddCard = () => {
    const paymentData = {
      id: `payment-${Date.now()}`,
      type: 'credit-card',
      details: {
        cardholderName,
        cardNumber: cardNumber.slice(-4), // Only store last 4 digits
        expiryDate,
        billingZip,
      },
    };
    setAddedPayments([...addedPayments, paymentData]);
    // Reset credit card form
    setCardholderName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setBillingZip('');
    // Switch to default method tab
    setActiveTab('default-method');
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
    setActiveTab('bank-account');
    onOpenChange(false);
  };

  const resetForm = () => {
    setCardholderName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setBillingZip('');
    setAccountHolderName('');
    setRoutingNumber('');
    setAccountNumber('');
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
      <TabsList className="w-full mb-4 gap-1">
        <TabsTrigger 
          value="bank-account" 
          className="flex-1 text-xs sm:text-sm px-2 min-h-[44px] rounded-md data-[state=active]:shadow-none"
          disabled={addedPayments.length > 0}
        >
          {isMobile ? '1. Bank' : '1. Add Bank Account'}
        </TabsTrigger>
        <TabsTrigger 
          value="credit-card" 
          className="flex-1 text-xs sm:text-sm px-2 min-h-[44px] rounded-md data-[state=active]:shadow-none"
          disabled={addedPayments.length === 0 || addedPayments.length > 1}
        >
          {isMobile ? '2. Card' : '2. Add Credit Card'}
        </TabsTrigger>
        <TabsTrigger 
          value="default-method" 
          className="flex-1 text-xs sm:text-sm px-2 min-h-[44px] rounded-md data-[state=active]:shadow-none" 
          disabled={addedPayments.length < 2}
        >
          {isMobile ? '3. Default' : '3. Set Default Method'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="credit-card" className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">Add Credit Card</h3>
          <p className="text-[hsl(var(--brand-blue))] text-sm">
            Add your credit card information for secure payment processing.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholder-name">
              Cardholder Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="cardholder-name"
              placeholder="Full name on card"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">
              Card Number<span className="text-destructive">*</span>
            </Label>
            <Input
              id="card-number"
              placeholder="1234 5647 2627 8901"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-date">
                Expiry Date<span className="text-destructive">*</span>
              </Label>
              <Input
                id="expiry-date"
                placeholder="MM/YYYY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={7}
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
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
                  className="pr-10 min-h-[44px]"
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

          <div className="space-y-2">
            <Label htmlFor="billing-zip">
              Billing ZIP Code<span className="text-destructive">*</span>
            </Label>
            <Input
              id="billing-zip"
              placeholder="12345"
              value={billingZip}
              onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              className="min-h-[44px]"
            />
          </div>
        </div>

        <Button
          onClick={handleAddCard}
          disabled={!cardholderName || !cardNumber || !expiryDate || !cvv || !billingZip}
          className="w-full min-h-[48px]"
          size="lg"
        >
          Add Card
        </Button>
      </TabsContent>

      <TabsContent value="default-method" className="space-y-4 sm:space-y-6">
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
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-semibold">Add Payment Details</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4 pb-4">
            {formContent}
          </ScrollArea>
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

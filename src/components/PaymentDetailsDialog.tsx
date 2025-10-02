import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: (paymentData: any) => void;
}

export const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
  onAddPayment,
}) => {
  const [activeTab, setActiveTab] = useState('credit-card');
  const [showCVV, setShowCVV] = useState(false);

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

  const handleAddCard = () => {
    const paymentData = {
      type: 'credit-card',
      details: {
        cardholderName,
        cardNumber: cardNumber.slice(-4), // Only store last 4 digits
        expiryDate,
        billingZip,
      },
    };
    onAddPayment(paymentData);
    // Reset credit card form
    setCardholderName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setBillingZip('');
    // Switch to bank account tab
    setActiveTab('bank-account');
  };

  const handleAddBankAccount = () => {
    const paymentData = {
      type: 'bank-account',
      details: {
        routingNumber,
        accountNumber: accountNumber.slice(-4), // Only store last 4 digits
      },
    };
    onAddPayment(paymentData);
    resetForm();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Payment Details</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="credit-card" className="text-xs sm:text-sm">
              1. Add Credit Card
            </TabsTrigger>
            <TabsTrigger value="bank-account" className="text-xs sm:text-sm">
              2. Add Bank Account
            </TabsTrigger>
            <TabsTrigger value="default-method" className="text-xs sm:text-sm" disabled>
              3. Set Default Method
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credit-card" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Add Credit Card</h3>
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
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCVV(!showCVV)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCVV ? <EyeOff size={18} /> : <Eye size={18} />}
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
                />
              </div>
            </div>

            <Button
              onClick={handleAddCard}
              disabled={!cardholderName || !cardNumber || !expiryDate || !cvv || !billingZip}
              className="w-full"
              size="lg"
            >
              Add Card
            </Button>
          </TabsContent>

          <TabsContent value="bank-account" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Add Bank Account</h3>
              <p className="text-[hsl(var(--brand-blue))] text-sm">
                Add your bank account information for secure ACH transfers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routing-number">
                  Routing Number<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="routing-number"
                  placeholder="9-digit routing number"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  maxLength={9}
                />
                <p className="text-xs text-muted-foreground">Must be a minimum of 8 digits</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number">
                  Account Number<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="account-number"
                  placeholder="5657 8858 3733 3383"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-xs text-muted-foreground">Must be at least 6 digits</p>
              </div>
            </div>

            <Button
              onClick={handleAddBankAccount}
              disabled={!routingNumber || routingNumber.length < 8 || !accountNumber || accountNumber.length < 6}
              className="w-full"
              size="lg"
            >
              Add Bank Account
            </Button>
          </TabsContent>

          <TabsContent value="default-method">
            <div className="py-8 text-center text-muted-foreground">
              <p>Please add at least one payment method first.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

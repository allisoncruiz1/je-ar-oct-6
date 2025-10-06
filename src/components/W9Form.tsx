import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BinaryChoice } from '@/components/ui/binary-choice';
import { MobileActionBar } from './MobileActionBar';
import { useIsMobile } from '@/hooks/use-mobile';

const w9Schema = z.object({
  ssn: z.string()
    .min(1, 'SSN is required')
    .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX'),
  isPaidByCompany: z.enum(['yes', 'no'], {
    required_error: 'Please select whether you are being paid by a company',
  }),
  companyEIN: z.string().optional(),
  companyName: z.string().optional(),
  companyAddressLine1: z.string().optional(),
  companyAddressLine2: z.string().optional(),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  companyZipCode: z.string().optional(),
  stateRecognition: z.string().optional(),
}).refine((data) => {
  if (data.isPaidByCompany === 'yes') {
    return !!(data.companyEIN && data.companyName && data.companyAddressLine1 && data.companyCity && data.companyState && data.companyZipCode);
  }
  return true;
}, {
  message: 'All company fields are required when being paid by a company',
  path: ['companyName'],
});

export type W9Data = z.infer<typeof w9Schema>;

interface W9FormProps {
  onContinue: () => void;
  onBack: () => void;
  onFormValidChange: (isValid: boolean) => void;
  onSaveResume?: () => void;
  initialData?: Partial<W9Data>;
  onFormDataChange?: (data: W9Data | null) => void;
  continueButtonText?: string;
  canContinue?: boolean;
  showBack?: boolean;
}

export const W9Form: React.FC<W9FormProps> = ({
  onContinue,
  onBack,
  onFormValidChange,
  onSaveResume,
  initialData,
  onFormDataChange,
  continueButtonText = 'Continue',
  canContinue = false,
  showBack = true,
}) => {
  const isMobile = useIsMobile();
  
  const form = useForm<W9Data>({
    resolver: zodResolver(w9Schema),
    mode: 'onChange',
    defaultValues: initialData || {
      ssn: '',
      isPaidByCompany: undefined,
      companyEIN: '',
      companyName: '',
      companyAddressLine1: '',
      companyAddressLine2: '',
      companyCity: '',
      companyState: '',
      companyZipCode: '',
      stateRecognition: '',
    },
  });

  const { watch, formState: { isValid } } = form;
  const isPaidByCompany = watch('isPaidByCompany');

  useEffect(() => {
    onFormValidChange(isValid);
  }, [isValid, onFormValidChange]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (isValid) {
        onFormDataChange?.(value as W9Data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isValid, onFormDataChange]);

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  };

  return (
    <Form {...form}>
      <div className="space-y-6 pb-24 md:pb-6">
        {/* Page Header */}
        <h1 className="text-xl font-semibold text-foreground">W9</h1>

        {/* Dark Banner Section */}
        <div className="bg-[hsl(var(--accent))] text-accent-foreground p-6 rounded-lg space-y-2">
          <p className="text-sm md:text-base">
            Lastly, let's collect some of your financial information – we only need a portion at this time. Please be assured that this information is safe and secure.
          </p>
          <h2 className="text-lg md:text-xl font-bold">Financial Information (Step 5 of 6)</h2>
        </div>

        {/* Information Section */}
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold text-[hsl(var(--brand-blue))]">W9 Information</h3>
          <p className="text-sm text-muted-foreground">
            Before issuing a payment, eXp must collect Form W-9 to obtain the necessary information for accurate reporting of earned revenue to the IRS via Form 1099-NEC or a similar form. Please answer the questions below and provide all applicable information to populate Form W-9 correctly.
          </p>
        </div>

        {/* SSN Field */}
        <FormField
          control={form.control}
          name="ssn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-foreground">
                Social Security Number (SSN) <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  onChange={(e) => {
                    const formatted = formatSSN(e.target.value);
                    field.onChange(formatted);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Payment Binary Choice */}
        <FormField
          control={form.control}
          name="isPaidByCompany"
          render={({ field }) => (
            <FormItem>
              <BinaryChoice
                label="Are you being paid by a company?"
                required
                value={field.value}
                onValueChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Fields - Conditionally Rendered */}
        {isPaidByCompany === 'yes' && (
          <div className="space-y-6 pl-4 border-l-2 border-border">
            <FormField
              control={form.control}
              name="companyEIN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company EIN <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="XX-XXXXXXX"
                      maxLength={10}
                      onChange={(e) => {
                        const formatted = formatEIN(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter company name" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold text-[hsl(var(--brand-blue))]">Note:</span> The EIN must match the company name
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyAddressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company Address Line 1 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Street address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyAddressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company Address Line 2
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Apt, suite, etc. (optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company City <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company State <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter state" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyZipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    Company ZIP Code <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter ZIP code" maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateRecognition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-foreground">
                    State Recognition
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter state recognition (optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Desktop Buttons */}
        {!isMobile && (
          <div className="flex gap-3 pt-4">
            {showBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onSaveResume}
              className="flex-1"
            >
              Save & Resume Later
            </Button>
            <Button
              type="button"
              onClick={onContinue}
              disabled={!canContinue}
              className="flex-1"
            >
              {continueButtonText}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Action Bar */}
      {isMobile && (
        <MobileActionBar
          onBack={showBack ? onBack : undefined}
          onContinue={onContinue}
          onSaveResume={onSaveResume}
          canContinue={canContinue}
          continueButtonText={continueButtonText}
        />
      )}
    </Form>
  );
};

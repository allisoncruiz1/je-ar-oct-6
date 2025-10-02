import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Example validation schema
const exampleSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z.string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, { 
      message: "Invalid phone number format (e.g., 123-456-7890)" 
    }),
  zipCode: z.string()
    .trim()
    .min(1, { message: "ZIP code is required" })
    .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format" }),
  accountType: z.enum(['personal', 'business'], {
    required_error: "Please select an account type"
  })
});

type ExampleFormData = z.infer<typeof exampleSchema>;

export const ErrorValidationExamples: React.FC = () => {
  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      phone: '',
      zipCode: '',
      accountType: undefined
    }
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log('✅ Form submitted with data:', data);
    alert(`Form submitted successfully!\n\nData:\n${JSON.stringify(data, null, 2)}`);
  };

  const { formState } = form;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Form Validation Examples</h1>
        <p className="text-muted-foreground">
          This page demonstrates how validation works across all forms in the application.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Real-time validation is active!</strong> Try leaving fields empty, entering invalid data, 
          or filling them correctly. Error messages appear immediately below each field.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field with Validation */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field with Validation */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="123-456-7890"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ZIP Code Field with Validation */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ZIP Code <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="12345"
                    maxLength={10}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Field with Validation */}
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Account Type <span className="text-destructive">*</span>
                </FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!formState.isValid}
              className="flex-1"
            >
              Submit Form
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="flex-1"
            >
              Reset Form
            </Button>
          </div>

          {/* Form State Display */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-foreground">Form State</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Valid:</span>{' '}
                <span className={formState.isValid ? 'text-green-600' : 'text-destructive'}>
                  {formState.isValid ? '✓ Yes' : '✗ No'}
                </span>
              </p>
              <p>
                <span className="font-medium">Dirty:</span>{' '}
                <span className={formState.isDirty ? 'text-blue-600' : 'text-muted-foreground'}>
                  {formState.isDirty ? '✓ Modified' : '✗ Pristine'}
                </span>
              </p>
              <p>
                <span className="font-medium">Errors:</span>{' '}
                <span className="text-destructive">
                  {Object.keys(formState.errors).length > 0 
                    ? `${Object.keys(formState.errors).length} field(s)`
                    : 'None'}
                </span>
              </p>
            </div>
          </div>
        </form>
      </Form>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-2">How Validation Works</h3>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Each field has validation rules defined in a Zod schema</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Validation runs automatically as you type (onChange mode)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Error messages appear below fields when validation fails</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>Submit button is disabled until all fields are valid</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">5.</span>
            <span>Errors clear automatically when you fix the input</span>
          </li>
        </ul>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        This validation pattern is implemented across all forms in the application to ensure data quality and provide immediate feedback to users.
      </div>
    </div>
  );
};

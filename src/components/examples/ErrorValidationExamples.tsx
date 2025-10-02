import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Example validation schema
const exampleSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z.string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d{10}$/, { message: "Phone must be exactly 10 digits" }),
  zipCode: z.string()
    .trim()
    .min(1, { message: "ZIP code is required" })
    .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format" }),
  accountType: z.string()
    .min(1, { message: "Please select an account type" })
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
      accountType: ''
    }
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Form Validation Examples</h1>
        <p className="text-muted-foreground">
          This page demonstrates error validation patterns. Try submitting the form without filling fields or with invalid data.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Validation Active</AlertTitle>
        <AlertDescription>
          All fields are required and will show validation errors when submitted or when you interact with them.
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
                    placeholder="example@email.com"
                    {...field}
                    className="h-11"
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
                    placeholder="1234567890"
                    maxLength={10}
                    {...field}
                    className="h-11"
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
                    placeholder="12345 or 12345-6789"
                    {...field}
                    className="h-11"
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal Account</SelectItem>
                    <SelectItem value="business">Business Account</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Submit Form
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
              className="flex-1"
            >
              Reset
            </Button>
          </div>

          {/* Form State Display */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Form State:</h3>
            <div className="text-xs space-y-1 font-mono">
              <div>Is Valid: {form.formState.isValid ? '✅ Yes' : '❌ No'}</div>
              <div>Is Dirty: {form.formState.isDirty ? 'Yes' : 'No'}</div>
              <div>Errors: {Object.keys(form.formState.errors).length}</div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

import { z } from 'zod';

// Address Form Validation
export const addressSchema = z.object({
  addressLine1: z.string()
    .trim()
    .min(1, { message: "Address is required" })
    .min(5, { message: "Address must be at least 5 characters" })
    .max(100, { message: "Address must be less than 100 characters" }),
  addressLine2: z.string()
    .trim()
    .max(50, { message: "Address line 2 must be less than 50 characters" })
    .optional(),
  city: z.string()
    .trim()
    .min(1, { message: "City is required" })
    .min(2, { message: "City must be at least 2 characters" })
    .max(50, { message: "City must be less than 50 characters" }),
  state: z.string()
    .trim()
    .min(1, { message: "State is required" })
    .length(2, { message: "State must be 2 characters" }),
  zipCode: z.string()
    .trim()
    .min(1, { message: "ZIP code is required" })
    .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format (e.g., 12345 or 12345-6789)" })
});

// License Business Info Validation
export const licenseBusinessSchema = z.object({
  preferredName: z.string()
    .trim()
    .min(1, { message: "Preferred name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
  hasLicense: z.enum(['yes', 'no'], { 
    required_error: "Please select whether you have a real estate license" 
  }),
  licensedStates: z.array(z.string()).optional(),
  internationalBusiness: z.enum(['yes', 'no']).optional(),
  internationalCountries: z.array(z.string()).optional()
}).refine((data) => {
  if (data.hasLicense === 'yes' && (!data.licensedStates || data.licensedStates.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Please select at least one licensed state",
  path: ["licensedStates"]
}).refine((data) => {
  if (data.internationalBusiness === 'yes' && (!data.internationalCountries || data.internationalCountries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Please select at least one country",
  path: ["internationalCountries"]
});

// Sponsor Form Validation
export const sponsorSchema = z.object({
  firstName: z.string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" })
    .optional()
    .or(z.literal('')),
  lastName: z.string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .optional()
    .or(z.literal('')),
  email: z.string()
    .trim()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be less than 255 characters" })
    .optional()
    .or(z.literal(''))
}).refine((data) => {
  return data.firstName || data.lastName || data.email;
}, {
  message: "At least one field (first name, last name, or email) is required",
  path: ["firstName"]
});

// Direct Deposit Validation
export const directDepositSchema = z.object({
  accountType: z.enum(['personal', 'business'], {
    required_error: "Please select an account type"
  }),
  businessName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bankName: z.string()
    .trim()
    .min(1, { message: "Bank name is required" })
    .max(100, { message: "Bank name must be less than 100 characters" }),
  routingNumber: z.string()
    .trim()
    .min(1, { message: "Routing number is required" })
    .regex(/^\d{9}$/, { message: "Routing number must be exactly 9 digits" }),
  accountNumber: z.string()
    .trim()
    .min(1, { message: "Account number is required" })
    .min(4, { message: "Account number must be at least 4 digits" })
    .max(17, { message: "Account number must be less than 17 digits" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" })
}).refine((data) => {
  if (data.accountType === 'business' && !data.businessName?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Business name is required for business accounts",
  path: ["businessName"]
}).refine((data) => {
  if (data.accountType === 'personal' && (!data.firstName?.trim() || !data.lastName?.trim())) {
    return false;
  }
  return true;
}, {
  message: "First and last name are required for personal accounts",
  path: ["firstName"]
});

// Payment Info Validation
export const paymentMethodSchema = z.object({
  type: z.enum(['credit-card', 'bank-account']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional()
}).refine((data) => {
  if (data.type === 'credit-card') {
    if (!data.cardNumber?.trim() || !data.expiryDate?.trim() || !data.cvv?.trim()) {
      return false;
    }
    // Validate card number (basic check)
    if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
      return false;
    }
    // Validate CVV
    if (!/^\d{3,4}$/.test(data.cvv)) {
      return false;
    }
  }
  return true;
}, {
  message: "Invalid credit card information",
  path: ["cardNumber"]
}).refine((data) => {
  if (data.type === 'bank-account') {
    if (!data.accountNumber?.trim() || !data.routingNumber?.trim()) {
      return false;
    }
    // Validate routing number
    if (!/^\d{9}$/.test(data.routingNumber)) {
      return false;
    }
  }
  return true;
}, {
  message: "Invalid bank account information",
  path: ["accountNumber"]
});

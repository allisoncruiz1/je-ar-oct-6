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

// License Details Validation (per state)
export const licenseDetailsSchema = z.object({
  licenseNumber: z.string()
    .trim()
    .min(1, { message: "License number is required" })
    .max(50, { message: "License number must be less than 50 characters" }),
  salesTransactions: z.string()
    .trim()
    .regex(/^\d+$/, { message: "Must be a valid number" }),
  pendingTransactions: z.string()
    .trim()
    .regex(/^\d+$/, { message: "Must be a valid number" }),
  associations: z.array(z.string())
    .min(1, { message: "Please select at least one association" }),
  primaryAssociation: z.string().optional(),
  mls: z.array(z.string())
    .min(1, { message: "Please select at least one MLS" }),
  certifiedMentor: z.enum(['yes', 'no']).optional()
}).refine((data) => {
  if (data.associations.length > 1 && (!data.primaryAssociation || !data.primaryAssociation.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please select your primary association",
  path: ["primaryAssociation"]
});

// Business Overview Validation
export const businessOverviewSchema = z.object({
  brokerageOwnership: z.enum(['yes', 'no'], { 
    required_error: "Please indicate brokerage ownership" 
  }),
  spouseAffiliated: z.enum(['yes', 'no'], { 
    required_error: "Please indicate spouse affiliation" 
  }),
  managesOffice: z.enum(['yes', 'no'], { 
    required_error: "Please indicate office management status" 
  }),
  formingPartnership: z.enum(['yes', 'no']).optional(),
  preExistingMatters: z.array(z.string()).optional(),
  otherDisclosureDetails: z.string()
    .max(500, { message: "Details must be less than 500 characters" })
    .optional(),
  licenseTransferDate: z.date().optional()
}).refine((data) => {
  if (data.spouseAffiliated === 'yes' && data.formingPartnership === undefined) {
    return false;
  }
  return true;
}, {
  message: "Please indicate partnership formation",
  path: ["formingPartnership"]
});

// Team Function Validation
export const teamFunctionSchema = z.object({
  agentType: z.enum(['individual', 'team'], { 
    required_error: "Please select how you'll work at eXp" 
  }),
  teamRole: z.string().optional(),
  teamName: z.string().optional(),
  teamLeaderName: z.string().optional(),
  customTeamName: z.string().optional(),
  teamDetails: z.string()
    .max(500, { message: "Details must be less than 500 characters" })
    .optional(),
  numberOfAgents: z.string().optional(),
  leaderTeamName: z.string().optional(),
  teamSetupDetails: z.string()
    .max(200, { message: "Details must be less than 200 characters" })
    .optional(),
  corporateStaffMember: z.enum(['yes', 'no'], { 
    required_error: "Please indicate if you're a corporate staff member" 
  })
}).refine((data) => {
  if (data.agentType === 'team' && (!data.teamRole || !data.teamRole.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please select your role within the team",
  path: ["teamRole"]
}).refine((data) => {
  if (data.teamRole === 'member' && (!data.teamName || !data.teamName.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please select which team you're joining",
  path: ["teamName"]
}).refine((data) => {
  if (data.teamName === 'cant-find' && (!data.teamLeaderName || !data.teamLeaderName.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please enter the team leader's name",
  path: ["teamLeaderName"]
}).refine((data) => {
  if (data.teamName === 'cant-find' && (!data.customTeamName || !data.customTeamName.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please enter the team name",
  path: ["customTeamName"]
}).refine((data) => {
  if (data.teamRole === 'leader' && (!data.numberOfAgents || !data.numberOfAgents.trim() || !/^\d+$/.test(data.numberOfAgents))) {
    return false;
  }
  return true;
}, {
  message: "Please enter a valid number of agents",
  path: ["numberOfAgents"]
}).refine((data) => {
  if (data.teamRole === 'leader' && (!data.leaderTeamName || !data.leaderTeamName.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please enter your team name",
  path: ["leaderTeamName"]
}).refine((data) => {
  if (data.teamRole === 'leader' && (!data.teamSetupDetails || !data.teamSetupDetails.trim())) {
    return false;
  }
  return true;
}, {
  message: "Please share details about your team setup",
  path: ["teamSetupDetails"]
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

// Payment Info Validation
export const paymentInfoSchema = z.object({
  thirdPartyPayment: z.enum(['yes', 'no'], { 
    required_error: "Please indicate third-party payment" 
  }),
  thirdPartyName: z.string().optional(),
  thirdPartyRelationship: z.string().optional(),
  paymentMethods: z.array(z.object({
    type: z.enum(['credit-card', 'bank-account']),
    last4: z.string()
  })).optional()
}).refine((data) => {
  if (data.thirdPartyPayment === 'yes' && (!data.thirdPartyName || !data.thirdPartyName.trim())) {
    return false;
  }
  return true;
}, {
  message: "Third party name is required",
  path: ["thirdPartyName"]
}).refine((data) => {
  if (data.thirdPartyPayment === 'yes' && (!data.thirdPartyRelationship || !data.thirdPartyRelationship.trim())) {
    return false;
  }
  return true;
}, {
  message: "Relationship to third party is required",
  path: ["thirdPartyRelationship"]
}).refine((data) => {
  if (data.thirdPartyPayment === 'no' && (!data.paymentMethods || data.paymentMethods.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one payment method",
  path: ["paymentMethods"]
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

// Payment Method Validation (for dialog)
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

// Simple validation helper function
export function validateField(schema: z.ZodSchema, data: any, field?: string): string | null {
  try {
    schema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (field) {
        const fieldError = error.errors.find(e => e.path.includes(field));
        return fieldError?.message || null;
      }
      return error.errors[0]?.message || "Validation error";
    }
    return "Validation error";
  }
}

import { AddressData, ValidationResult } from '@/components/AddressValidationDialog';

// Mock address validation service - simulates API response
export const validateAddress = async (address: AddressData): Promise<ValidationResult | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock validation logic - detect common issues and suggest corrections
  let needsValidation = false;
  const suggested: AddressData = { ...address };

  // Example validations that would trigger the modal
  
  // 1. Missing apartment/unit number detection
  if (address.addressLine1.toLowerCase().includes('apt') && 
      !address.addressLine1.toLowerCase().includes('apt ')) {
    suggested.addressLine1 = address.addressLine1.replace(/apt/i, 'Apt ');
    needsValidation = true;
  }

  // 2. Street name corrections
  if (address.addressLine1.toLowerCase().includes('main st')) {
    suggested.addressLine1 = address.addressLine1.replace(/main st/i, 'Main Street');
    needsValidation = true;
  }

  // 3. ZIP code format corrections
  if (address.zipCode.length === 5 && !address.zipCode.includes('-')) {
    // Add +4 extension for demonstration
    suggested.zipCode = `${address.zipCode}-0001`;
    needsValidation = true;
  }

  // 4. City name standardization
  const cityCorrections: Record<string, string> = {
    'la': 'Los Angeles',
    'ny': 'New York',
    'sf': 'San Francisco',
    'dc': 'Washington'
  };

  const lowerCity = address.city.toLowerCase();
  if (cityCorrections[lowerCity]) {
    suggested.city = cityCorrections[lowerCity];
    needsValidation = true;
  }

  // 5. State abbreviation standardization
  if (address.state.length > 2) {
    const stateAbbr: Record<string, string> = {
      'california': 'CA',
      'new york': 'NY',
      'texas': 'TX',
      'florida': 'FL'
    };
    
    const lowerState = address.state.toLowerCase();
    if (stateAbbr[lowerState]) {
      suggested.state = stateAbbr[lowerState];
      needsValidation = true;
    }
  }

  // Return validation result only if suggestions were made
  if (needsValidation) {
    return {
      suggested,
      original: address
    };
  }

  return null; // No validation needed
};
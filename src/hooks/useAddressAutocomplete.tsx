import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: typeof google;
  }
}

interface AddressComponents {
  street_number?: string;
  route?: string;
  locality?: string;
  administrative_area_level_1?: string;
  postal_code?: string;
  subpremise?: string;
}

interface PlaceResult {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

export const useAddressAutocomplete = (
  inputRef: React.RefObject<HTMLInputElement>,
  onPlaceSelected: (result: PlaceResult) => void
) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Temporarily disabled for debugging
    console.log('Address autocomplete hook mounted');
    return () => {
      console.log('Address autocomplete hook unmounted');
    };
  }, [inputRef, onPlaceSelected]);

  return autocompleteRef.current;
};
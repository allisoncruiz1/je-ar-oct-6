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
    if (!inputRef.current) return;

    // Initialize Google Places Autocomplete
    const initAutocomplete = () => {
      if (!window.google?.maps?.places) {
        console.warn('Google Maps API not loaded');
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current!,
        {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address'],
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;

        const components: AddressComponents = {};
        
        place.address_components.forEach((component) => {
          const type = component.types[0];
          components[type as keyof AddressComponents] = component.short_name;
        });

        const result: PlaceResult = {
          addressLine1: `${components.street_number || ''} ${components.route || ''}`.trim(),
          addressLine2: components.subpremise || '',
          city: components.locality || '',
          state: components.administrative_area_level_1 || '',
          zipCode: components.postal_code || '',
        };

        onPlaceSelected(result);
      });

      autocompleteRef.current = autocomplete;
    };

    // Load Google Maps API if not already loaded
    if (!window.google?.maps?.places) {
      const script = document.createElement('script');
      // Note: Replace 'YOUR_API_KEY' with actual Google Maps API key in production
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [inputRef, onPlaceSelected]);

  return autocompleteRef.current;
};
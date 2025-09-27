import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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
    let cleanup: (() => void) | undefined;

    const init = async () => {
      if (!inputRef.current) return;
      const explicitKey = (window as any).__GMAPS_API_KEY;
      const metaKey = document.querySelector<HTMLMetaElement>('meta[name="gmaps-api-key"]')?.content;
      const dataKey = document.documentElement?.dataset?.gmapsApiKey;
      const apiKey = explicitKey || metaKey || dataKey || 'YOUR_API_KEY';

      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('Google Maps API key missing; autocomplete disabled.');
        return;
      }

      try {
        const loader = new Loader({ apiKey, libraries: ['places'] });
        await loader.load();
        if (!inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address'],
        });

        const listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.address_components) return;

          const components: AddressComponents = {};
          
          // Parse all address components properly
          place.address_components.forEach((component) => {
            component.types.forEach((type) => {
              if (type === 'street_number') components.street_number = component.short_name;
              if (type === 'route') components.route = component.short_name;
              if (type === 'locality') components.locality = component.short_name;
              if (type === 'administrative_area_level_1') components.administrative_area_level_1 = component.short_name;
              if (type === 'postal_code') components.postal_code = component.short_name;
              if (type === 'subpremise') components.subpremise = component.short_name;
            });
          });

          const result: PlaceResult = {
            addressLine1: `${components.street_number || ''} ${components.route || ''}`.trim(),
            addressLine2: components.subpremise || '',
            city: components.locality || '',
            state: components.administrative_area_level_1 || '',
            zipCode: components.postal_code || '',
          };
          
          console.log('Google Places result:', result);
          onPlaceSelected(result);
        });

        autocompleteRef.current = autocomplete;

        cleanup = () => {
          listener.remove();
          google.maps.event.clearInstanceListeners(autocomplete);
        };
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
      }
    };

    init();

    return () => {
      cleanup?.();
    };
  }, [onPlaceSelected, inputRef]);

  return autocompleteRef.current;
};
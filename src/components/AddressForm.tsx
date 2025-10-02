import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { getCityStateFromZip } from '@/utils/zipCodeData';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { addressSchema } from '@/schemas/formValidation';
import { AddressConfirmationDialog } from '@/components/AddressConfirmationDialog';
import { z } from 'zod';
import { supabase } from "@/integrations/supabase/client";
interface AddressFormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}
interface AddressFormProps {
  onSubmit?: (data: AddressFormData) => void;
  onContinue?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  canContinue?: boolean;
  showBack?: boolean;
  initialData?: AddressFormData;
  onFormDataChange?: (data: AddressFormData) => void;
  continueButtonText?: string;
}
export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onContinue,
  onFormValidChange,
  onSaveResume,
  onBack,
  canContinue,
  showBack,
  initialData,
  onFormDataChange,
  continueButtonText = "Continue"
}) => {
  const [formData, setFormData] = useState<AddressFormData>(initialData || {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const addressInputRef = useRef<HTMLInputElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top on mobile, action bar on desktop
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        actionBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isAutocompleting, setIsAutocompleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [suggestedAddress, setSuggestedAddress] = useState<AddressFormData | null>(null);
  const [validating, setValidating] = useState(false);
  const fetchTimeoutRef = useRef<number | null>(null);
  const {
    setFieldRef,
    scrollToNextField
  } = useAutoScroll();
  const isMobile = useIsMobile();
  const [stateDrawerOpen, setStateDrawerOpen] = React.useState(false);
  const US_STATE_ABBR: Record<string, string> = {
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
    'District of Columbia': 'DC'
  };
  const US_STATES = [{
    code: 'AL',
    name: 'Alabama'
  }, {
    code: 'AK',
    name: 'Alaska'
  }, {
    code: 'AZ',
    name: 'Arizona'
  }, {
    code: 'AR',
    name: 'Arkansas'
  }, {
    code: 'CA',
    name: 'California'
  }, {
    code: 'CO',
    name: 'Colorado'
  }, {
    code: 'CT',
    name: 'Connecticut'
  }, {
    code: 'DE',
    name: 'Delaware'
  }, {
    code: 'FL',
    name: 'Florida'
  }, {
    code: 'GA',
    name: 'Georgia'
  }, {
    code: 'HI',
    name: 'Hawaii'
  }, {
    code: 'ID',
    name: 'Idaho'
  }, {
    code: 'IL',
    name: 'Illinois'
  }, {
    code: 'IN',
    name: 'Indiana'
  }, {
    code: 'IA',
    name: 'Iowa'
  }, {
    code: 'KS',
    name: 'Kansas'
  }, {
    code: 'KY',
    name: 'Kentucky'
  }, {
    code: 'LA',
    name: 'Louisiana'
  }, {
    code: 'ME',
    name: 'Maine'
  }, {
    code: 'MD',
    name: 'Maryland'
  }, {
    code: 'MA',
    name: 'Massachusetts'
  }, {
    code: 'MI',
    name: 'Michigan'
  }, {
    code: 'MN',
    name: 'Minnesota'
  }, {
    code: 'MS',
    name: 'Mississippi'
  }, {
    code: 'MO',
    name: 'Missouri'
  }, {
    code: 'MT',
    name: 'Montana'
  }, {
    code: 'NE',
    name: 'Nebraska'
  }, {
    code: 'NV',
    name: 'Nevada'
  }, {
    code: 'NH',
    name: 'New Hampshire'
  }, {
    code: 'NJ',
    name: 'New Jersey'
  }, {
    code: 'NM',
    name: 'New Mexico'
  }, {
    code: 'NY',
    name: 'New York'
  }, {
    code: 'NC',
    name: 'North Carolina'
  }, {
    code: 'ND',
    name: 'North Dakota'
  }, {
    code: 'OH',
    name: 'Ohio'
  }, {
    code: 'OK',
    name: 'Oklahoma'
  }, {
    code: 'OR',
    name: 'Oregon'
  }, {
    code: 'PA',
    name: 'Pennsylvania'
  }, {
    code: 'RI',
    name: 'Rhode Island'
  }, {
    code: 'SC',
    name: 'South Carolina'
  }, {
    code: 'SD',
    name: 'South Dakota'
  }, {
    code: 'TN',
    name: 'Tennessee'
  }, {
    code: 'TX',
    name: 'Texas'
  }, {
    code: 'UT',
    name: 'Utah'
  }, {
    code: 'VT',
    name: 'Vermont'
  }, {
    code: 'VA',
    name: 'Virginia'
  }, {
    code: 'WA',
    name: 'Washington'
  }, {
    code: 'WV',
    name: 'West Virginia'
  }, {
    code: 'WI',
    name: 'Wisconsin'
  }, {
    code: 'WY',
    name: 'Wyoming'
  }, {
    code: 'DC',
    name: 'District of Columbia'
  }];
  const parseNominatimAddress = (addr: any) => {
    // Robust parsing for OpenStreetMap data (US only)
    const house = addr.house_number || '';
    const street = addr.road || addr.street || addr.residential || addr.pedestrian || addr.cycleway || addr.footway || addr.highway || '';
    const line1 = `${house} ${street}`.trim();

    // Use unit/building info as line 2
    const line2 = addr.subpremise || addr.unit || addr.building || addr.suburb || addr.neighbourhood || addr.quarter || '';

    // Prefer city; include township/borough/district fallbacks
    const city = addr.city || addr.town || addr.township || addr.village || addr.hamlet || addr.municipality || addr.city_district || addr.borough || addr.county || '';

    // Get state abbreviation when possible
    const stateName = addr.state || '';
    const iso = addr['ISO3166-2-lvl4'] || addr['ISO3166-2-lvl3'] || '';
    let state = (iso ? iso.split('-')[1] : '') || addr.state_code || US_STATE_ABBR[stateName] || stateName || '';
    state = state.toUpperCase();

    // Postal code
    const zipCode = addr.postcode || addr.postal_code || '';
    const result = {
      addressLine1: line1,
      addressLine2: line2,
      city,
      state,
      zipCode
    };
    console.log('OpenStreetMap parsed result:', result, 'from addr:', addr);
    return result;
  };

  // Handle autocomplete selection (Google or fallback)
  const handlePlaceSelected = useCallback((result: any) => {
    console.log('🚀 handlePlaceSelected called with:', result);
    setIsAutocompleting(true);
    const newData = {
      addressLine1: result.addressLine1,
      addressLine2: result.addressLine2,
      city: result.city,
      state: result.state,
      zipCode: result.zipCode
    };
    console.log('📝 Setting form data to:', newData);
    setFormData(newData);
    // Clear all field errors when autocomplete populates the form
    setFieldErrors({});
    onFormDataChange?.(newData);
    setVerified(true);
    setShowSuggestions(false);
    console.log('⏰ Setting autocompleting flag to false after delay');
    // Reset autocompleting flag after a brief delay to prevent cascade
    setTimeout(() => {
      console.log('✅ Autocompleting flag reset to false');
      setIsAutocompleting(false);
      // Scroll to city field after address is selected
      scrollToNextField(0);
    }, 500); // Increased delay to ensure form validity doesn't trigger progression
  }, [onFormDataChange, scrollToNextField]);
  useAddressAutocomplete(addressInputRef, handlePlaceSelected);
  const searchFallbackSuggestions = async (query: string) => {
    const q = (query || '').trim();
    if (q.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const startsWithNumber = /^\d+\s+/.test(q);
      let url: string;
      if (startsWithNumber) {
        // Structured search biases to street-level, improves residential hits - restricted to Florida
        url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=us&state=Florida&dedupe=1&street=${encodeURIComponent(q)}`;
      } else {
        url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=us&state=Florida&dedupe=1&q=${encodeURIComponent(q)}`;
      }
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      const isResidentialBuilding = (item: any) => {
        const cls = item.class;
        const typ = (item.type || '').toLowerCase();
        const residentialTypes = ['house', 'residential', 'apartments', 'detached', 'semidetached_house', 'terrace', 'yes'];
        const nonResidentialTypes = ['retail', 'commercial', 'industrial', 'warehouse', 'public', 'school', 'hospital', 'hotel', 'manufacture'];
        if (cls !== 'building' && !(cls === 'place' && typ === 'house')) return false;
        if (nonResidentialTypes.includes(typ)) return false;
        return residentialTypes.includes(typ) || cls === 'place';
      };
      const hasAddressBits = (a: any) => !!(a.house_number && (a.road || a.street) && a.postcode);
      const inUS = (a: any) => a?.country_code === 'us' || a?.country === 'United States';
      const inFlorida = (a: any) => a?.state === 'Florida' || a?.['ISO3166-2-lvl4'] === 'US-FL';
      const filtered = items.filter((item: any) => {
        const a = item.address || {};
        return inUS(a) && inFlorida(a) && hasAddressBits(a) && isResidentialBuilding(item);
      }).slice(0, 5);
      console.log('[Nominatim] q=', q, 'items=', items.length, 'filtered=', filtered.length, filtered.map((i: any) => ({
        cls: i.class,
        type: i.type,
        addr: i.address
      })));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch (e) {
      console.error('Fallback address search failed', e);
    }
  };
  const handleFallbackSelect = (item: any) => {
    const parsed = parseNominatimAddress(item.address);
    if (!parsed.addressLine1 || !parsed.city || !parsed.state || !parsed.zipCode) {
      toast.error('Please select a full residential street address (with number, city, state, ZIP).');
      return;
    }
    handlePlaceSelected(parsed);
  };
  // Validate a single field
  const validateField = (field: keyof AddressFormData, value: string) => {
    try {
      // Create a temporary form data object with the new value for accurate validation
      const tempFormData = { ...formData, [field]: value };
      addressSchema.parse(tempFormData);
      
      // Clear error for this field
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Find errors for this specific field
        const fieldError = error.errors.find(e => e.path[0] === field);
        if (fieldError) {
          setFieldErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
        } else {
          // Clear error if no error for this field
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    
    if (field === 'addressLine1') {
      setVerified(false);
      const hasGoogle = typeof window !== 'undefined' && (window as any).google?.maps?.places;
      if (!hasGoogle) {
        if (fetchTimeoutRef.current) window.clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = window.setTimeout(() => {
          searchFallbackSuggestions(value);
        }, 250);
      } else {
        setShowSuggestions(false);
      }
    }

    // Handle ZIP code autofill with improved logic
    if (field === 'zipCode' && value.length >= 5) {
      const cityState = getCityStateFromZip(value.slice(0, 5));
      if (cityState) {
        // Only autofill if fields are empty or if it's a new zip
        if (!formData.city || !formData.state || formData.zipCode.slice(0, 5) !== value.slice(0, 5)) {
          newData.city = cityState.city;
          newData.state = cityState.state;
        }
      }
    }

    setFormData(newData);
    onFormDataChange?.(newData);

    // Validate on change if field has been touched
    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: keyof AddressFormData) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };
  const handleContinue = async () => {
    // Validate all fields first
    try {
      addressSchema.parse(formData);

      // If address was verified via autocomplete, skip confirmation
      if (verified) {
        onContinue?.();
        return;
      }

      // Manually entered address: validate via USPS
      setValidating(true);
      setSuggestedAddress(null);
      try {
        const { data, error } = await supabase.functions.invoke('usps-validate', {
          body: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
        });

        if (error) {
          console.error('usps-validate error:', error);
          toast.error('Unable to validate address. Please check your USPS configuration.');
        }
        
        if (data?.suggestedAddress) {
          setSuggestedAddress(data.suggestedAddress);
        } else if (data && !data.deliverable) {
          // USPS could not validate but no suggestion provided
          toast.info('Address could not be automatically verified. Please confirm it is correct.');
        }
      } catch (e) {
        console.error('Error calling usps-validate:', e);
        toast.error('Address validation service unavailable. Please verify your address manually.');
      } finally {
        setValidating(false);
        setShowConfirmDialog(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFieldErrors(errors);

        // Mark all fields as touched
        setTouchedFields({
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          zipCode: true,
        });

        toast.error('Please correct the errors before continuing');
      }
    }
  };

  const handleUseCurrentAddress = () => {
    setShowConfirmDialog(false);
    onContinue?.();
  };

  const handleUseSuggestedAddress = () => {
    if (suggestedAddress) {
      setFormData(suggestedAddress);
      onFormDataChange?.(suggestedAddress);
      setVerified(true);
    }
    setShowConfirmDialog(false);
    onContinue?.();
  };
  const isFormComplete = !!(formData.addressLine1 && formData.city && formData.state && formData.zipCode);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Notify parent of form validity changes
  useEffect(() => {
    console.log('🔄 Form validity effect triggered. isFormComplete:', isFormComplete, 'isAutocompleting:', isAutocompleting);
    // Don't notify during autocomplete to prevent cascade progression
    if (!isAutocompleting) {
      console.log('📢 Notifying parent of form validity change:', isFormComplete);
      onFormValidChange?.(isFormComplete);
    } else {
      console.log('🚫 Skipping form validity notification during autocomplete');
    }
  }, [isFormComplete, isAutocompleting]); // Removed onFormValidChange from dependencies to prevent infinite loops

  useEffect(() => {
    const logWidth = () => console.log("AddressForm mounted/rendered. viewport:", window.innerWidth);
    logWidth();
    window.addEventListener("resize", logWidth);
    return () => window.removeEventListener("resize", logWidth);
  }, []);
  const hasGoogle = typeof window !== 'undefined' && (window as any).google?.maps?.places;
  return <form onSubmit={handleSubmit} className="w-full text-base mt-1 max-md:max-w-full pb-28 md:pb-0">
      <h2 className="text-foreground mb-6 mt-4 font-semibold text-xl">Mailing Address</h2>
      
      <div ref={setFieldRef(0)} className="w-full max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 max-md:max-w-full text-sm">
          Address Line 1
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input 
            ref={addressInputRef} 
            type="text" 
            value={formData.addressLine1} 
            onChange={e => handleInputChange('addressLine1', e.target.value)} 
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150);
              handleFieldBlur('addressLine1');
            }}
            placeholder="Start typing your address..." 
            required 
            className={cn(
              "justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid max-md:max-w-full focus:outline-none text-sm",
              fieldErrors.addressLine1 && touchedFields.addressLine1 
                ? "border-destructive focus:ring-2 focus:ring-destructive"
                : "border-border focus:ring-2 focus:ring-ring focus:border-transparent"
            )}
            aria-describedby="address1-help" 
            autoComplete="off" 
            onFocus={() => {
              if (!hasGoogle && suggestions.length > 0) setShowSuggestions(true);
            }} 
          />

          {verified && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Verified
            </span>}
          
          {fieldErrors.addressLine1 && touchedFields.addressLine1 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}

          {!hasGoogle && showSuggestions && suggestions.length > 0 && <ul className="absolute left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto z-50">
              {suggestions.map((item, idx) => <li key={item.place_id || item.osm_id || idx}>
                  <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFallbackSelect(item)} className="w-full text-left px-3 py-2 hover:bg-accent text-sm text-foreground">
                    {item.display_name}
                  </button>
                </li>)}
            </ul>}
        </div>
        
        {fieldErrors.addressLine1 && touchedFields.addressLine1 ? (
          <p className="mt-1 text-sm text-destructive">{fieldErrors.addressLine1}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Street address with number (e.g., 123 Main St)</p>
        )}
      </div>

      <div className="w-full mt-6 max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-foreground font-semibold max-md:max-w-full text-sm">
          Address Line 2 (Optional)
        </label>
        <input 
          type="text" 
          value={formData.addressLine2} 
          onChange={e => handleInputChange('addressLine2', e.target.value)} 
          onBlur={() => handleFieldBlur('addressLine2')}
          placeholder="Apartment, suite, unit, building, etc" 
          className="justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid border-border max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm" 
        />
        <p className="mt-1 text-xs text-muted-foreground">Apt, suite, unit, building, floor, etc.</p>
      </div>

      <div ref={setFieldRef(1)} className="w-full mt-6 max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 max-md:max-w-full text-sm">
          City
          <span className="text-destructive">*</span>
        </label>
        <input 
          type="text" 
          value={formData.city} 
          onChange={e => handleInputChange('city', e.target.value)} 
          onBlur={() => {
            if ((formData.city || '').trim()) scrollToNextField(1);
            handleFieldBlur('city');
          }} 
          placeholder="City" 
          required 
          className={cn(
            "justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid max-md:max-w-full focus:outline-none text-sm",
            fieldErrors.city && touchedFields.city 
              ? "border-destructive focus:ring-2 focus:ring-destructive"
              : "border-border focus:ring-2 focus:ring-ring focus:border-transparent"
          )}
        />
        {fieldErrors.city && touchedFields.city ? (
          <p className="mt-1 text-sm text-destructive">{fieldErrors.city}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Auto-filled from ZIP code if available</p>
        )}
      </div>

      <div className="flex w-full gap-4 mt-6 max-md:flex-col max-md:gap-4">
        <div ref={setFieldRef(2)} className="w-40 max-md:w-full">
          <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 text-sm">
            State
            <span className="text-destructive">*</span>
          </label>
          
          {isMobile ? (
            <Drawer open={stateDrawerOpen} onOpenChange={setStateDrawerOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "justify-start items-center border flex w-full gap-2 font-normal bg-background mt-1 p-3 rounded-lg border-solid focus:outline-none text-sm",
                    fieldErrors.state && touchedFields.state 
                      ? "border-destructive focus:ring-2 focus:ring-destructive"
                      : "border-border focus:ring-2 focus:ring-ring focus:border-transparent",
                    formData.state ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {formData.state ? US_STATES.find(s => s.code === formData.state)?.name : "Select State"}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[60vh]">
                <DrawerHeader>
                  <DrawerTitle>Select State</DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto px-4 pb-4">
                  {US_STATES.map(state => (
                    <button
                      key={state.code}
                      type="button"
                      onClick={() => {
                        handleInputChange('state', state.code);
                        handleFieldBlur('state');
                        scrollToNextField(2);
                        setStateDrawerOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-4 border-b border-border hover:bg-accent transition-colors",
                        formData.state === state.code && "bg-accent font-semibold"
                      )}
                    >
                      {state.name}
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Select
              value={formData.state} 
              onValueChange={value => {
                handleInputChange('state', value);
                handleFieldBlur('state');
                scrollToNextField(2);
              }}
            >
              <SelectTrigger className={cn(
                "justify-start items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid focus:outline-none text-sm",
                fieldErrors.state && touchedFields.state 
                  ? "border-destructive focus:ring-2 focus:ring-destructive"
                  : "border-border focus:ring-2 focus:ring-ring focus:border-transparent"
              )}>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map(state => <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {fieldErrors.state && touchedFields.state && (
            <p className="mt-1 text-sm text-destructive">{fieldErrors.state}</p>
          )}
        </div>

        <div ref={setFieldRef(3)} className="flex-1 max-md:w-full">
          <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 text-sm">
            Zip code
            <span className="text-destructive">*</span>
          </label>
          <input 
            type="text" 
            value={formData.zipCode} 
            onChange={e => handleInputChange('zipCode', e.target.value)} 
            onBlur={() => handleFieldBlur('zipCode')}
            placeholder="12345" 
            required 
            pattern="[0-9]{5}(-[0-9]{4})?" 
            maxLength={10}
            className={cn(
              "justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid focus:outline-none text-sm",
              fieldErrors.zipCode && touchedFields.zipCode 
                ? "border-destructive focus:ring-2 focus:ring-destructive"
                : "border-border focus:ring-2 focus:ring-ring focus:border-transparent"
            )}
          />
          {fieldErrors.zipCode && touchedFields.zipCode ? (
            <p className="mt-1 text-sm text-destructive">{fieldErrors.zipCode}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">5 digits (e.g., 12345) or 9 digits (12345-6789)</p>
          )}
        </div>
      </div>

      {/* Desktop action bar */}
      <div ref={actionBarRef} className="bg-background border-t border-border p-4 mt-6 max-md:hidden">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onSaveResume} aria-label="Save and resume application later">
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            {showBack && <Button variant="ghost" size="sm" onClick={onBack} aria-label="Go back to previous step">
                Back
              </Button>}
            <Button type="button" size="sm" onClick={handleContinue} disabled={!canContinue} aria-label="Continue to next step">
              {continueButtonText}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile action bar */}
      <MobileActionBar onBack={onBack} onContinue={handleContinue} onSaveResume={onSaveResume} canContinue={canContinue} showBack={showBack} continueButtonText={continueButtonText} />
      
      {/* Address Confirmation Dialog */}
      <AddressConfirmationDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleUseCurrentAddress}
        onEdit={() => setShowConfirmDialog(false)}
        onUseSuggested={suggestedAddress ? handleUseSuggestedAddress : undefined}
        suggestedAddress={suggestedAddress || undefined}
        address={formData}
        isVerified={verified}
      />
    </form>;
};
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { getCityStateFromZip } from '@/utils/zipCodeData';
import { Check, ChevronDown } from 'lucide-react';
import { MobileMultiSelect } from '@/components/ui/mobile-multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { cn } from '@/lib/utils';
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
  onFormDataChange
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
  
  // Auto-scroll to show action bar on component mount
  useEffect(() => {
    if (actionBarRef.current) {
      setTimeout(() => {
        actionBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 500);
    }
  }, []);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isAutocompleting, setIsAutocompleting] = useState(false);
  const fetchTimeoutRef = useRef<number | null>(null);
  const {
    setFieldRef,
    scrollToNextField
  } = useAutoScroll();
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
  const isMobile = useIsMobile();
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

    // Handle ZIP code autofill
    if (field === 'zipCode' && value.length >= 5) {
      const cityState = getCityStateFromZip(value);
      if (cityState && !formData.city && !formData.state) {
        newData.city = cityState.city;
        newData.state = cityState.state;
      }
    }
    setFormData(newData);
    onFormDataChange?.(newData);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };
  const handleContinue = () => {
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
          <input ref={addressInputRef} type="text" value={formData.addressLine1} onChange={e => handleInputChange('addressLine1', e.target.value)} placeholder="Start typing your address..." required className="justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid border-border max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm" aria-describedby="address1-help" autoComplete="off" onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} onFocus={() => {
          if (!hasGoogle && suggestions.length > 0) setShowSuggestions(true);
        }} />

          {verified && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Verified
            </span>}

          {!hasGoogle && showSuggestions && suggestions.length > 0 && <ul className="absolute left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto z-50">
              {suggestions.map((item, idx) => <li key={item.place_id || item.osm_id || idx}>
                  <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFallbackSelect(item)} className="w-full text-left px-3 py-2 hover:bg-accent text-sm text-foreground">
                    {item.display_name}
                  </button>
                </li>)}
            </ul>}
        </div>
      </div>

      <div className="w-full mt-6 max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-foreground font-semibold max-md:max-w-full text-sm">
          Address Line 2 (Optional)
        </label>
        <input type="text" value={formData.addressLine2} onChange={e => handleInputChange('addressLine2', e.target.value)} placeholder="Apartment, suite, unit, building, etc" className="justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid border-border max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
      </div>

      <div ref={setFieldRef(1)} className="w-full mt-6 max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 max-md:max-w-full text-sm">
          City
          <span className="text-destructive">*</span>
        </label>
          <input type="text" value={formData.city} onChange={e => handleInputChange('city', e.target.value)} onBlur={() => {
        if ((formData.city || '').trim()) scrollToNextField(1);
      }} placeholder="City" required className="justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid border-border max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
      </div>

      <div className="flex w-full gap-4 mt-6 max-md:flex-col max-md:gap-4">
        <div ref={setFieldRef(2)} className="w-40 max-md:w-full">
          <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 text-sm">
            State
            <span className="text-destructive">*</span>
          </label>
          
          {isMobile ? <MobileMultiSelect options={US_STATES.map(state => state.name)} selectedValues={formData.state ? [US_STATES.find(s => s.code === formData.state)?.name || ''] : []} onSelectionChange={values => {
          if (values.length > 0) {
            const selectedState = US_STATES.find(s => s.name === values[0]);
            if (selectedState) {
              handleInputChange('state', selectedState.code);
              scrollToNextField(2);
            }
          } else {
            handleInputChange('state', '');
          }
        }} placeholder="Select State" searchPlaceholder="Search states..." className="mt-1" /> : <Select value={formData.state} onValueChange={value => {
          handleInputChange('state', value);
          scrollToNextField(2);
        }}>
              <SelectTrigger className="justify-start items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto z-50">
                {US_STATES.map(state => <SelectItem key={state.code} value={state.code} className="px-3 py-2 hover:bg-accent text-sm text-foreground cursor-pointer">
                    {state.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>}
        </div>

        <div ref={setFieldRef(3)} className="flex-1 max-md:w-full">
          <label className="flex w-full items-center gap-1 text-foreground font-semibold leading-6 text-sm">
            Zip code
            <span className="text-destructive">*</span>
          </label>
          <input type="text" value={formData.zipCode} onChange={e => handleInputChange('zipCode', e.target.value)} placeholder="12345" required pattern="[0-9]{5}(-[0-9]{4})?" className="justify-center items-center border flex w-full gap-2 text-muted-foreground font-normal bg-background mt-1 p-3 rounded-lg border-solid border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm" />
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
            <Button type="button" size="sm" onClick={onContinue} disabled={!canContinue} aria-label="Continue to next step">
              Continue
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile action bar */}
      <MobileActionBar onBack={onBack} onContinue={onContinue} onSaveResume={onSaveResume} canContinue={canContinue} showBack={showBack} />
    </form>;
};
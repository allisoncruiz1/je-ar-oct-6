import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { getCityStateFromZip } from '@/utils/zipCodeData';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onContinue, onFormValidChange, onSaveResume, onBack, canContinue, showBack, initialData, onFormDataChange }) => {
  const [formData, setFormData] = useState<AddressFormData>(initialData || {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const addressInputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isAutocompleting, setIsAutocompleting] = useState(false);
  const fetchTimeoutRef = useRef<number | null>(null);

  const US_STATE_ABBR: Record<string, string> = {
    Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
    Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
    Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA',
    Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
    Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR',
    Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
    Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
    'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC'
  };

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
      zipCode,
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
      zipCode: result.zipCode,
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
    }, 500); // Increased delay to ensure form validity doesn't trigger progression
  }, [onFormDataChange]);

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
        // Structured search biases to street-level, improves residential hits
        url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=us&dedupe=1&street=${encodeURIComponent(q)}`;
      } else {
        url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=us&dedupe=1&q=${encodeURIComponent(q)}`;
      }

      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];

      const isResidentialBuilding = (item: any) => {
        const cls = item.class;
        const typ = (item.type || '').toLowerCase();
        const residentialTypes = ['house','residential','apartments','detached','semidetached_house','terrace','yes'];
        const nonResidentialTypes = ['retail','commercial','industrial','warehouse','public','school','hospital','hotel','manufacture'];
        if (cls !== 'building' && !(cls === 'place' && typ === 'house')) return false;
        if (nonResidentialTypes.includes(typ)) return false;
        return residentialTypes.includes(typ) || cls === 'place';
      };

      const hasAddressBits = (a: any) => !!(a.house_number && (a.road || a.street) && a.postcode);
      const inUS = (a: any) => a?.country_code === 'us' || a?.country === 'United States';

      const filtered = items.filter((item: any) => {
        const a = item.address || {};
        return inUS(a) && hasAddressBits(a) && isResidentialBuilding(item);
      }).slice(0, 5);

      console.log('[Nominatim] q=', q, 'items=', items.length, 'filtered=', filtered.length, filtered.map((i: any) => ({cls: i.class, type: i.type, addr: i.address})));

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
    const newData = { ...formData, [field]: value };

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

  return (
    <form onSubmit={handleSubmit} className="w-full text-base mt-1 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-[#0c0f24] font-semibold leading-6 max-md:max-w-full text-sm">
          Address Line 1
          <span className="text-[#A91616]">*</span>
        </label>
        <div className="relative">
          <input
            ref={addressInputRef}
            type="text"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            placeholder="Start typing your address..."
            required
        className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent text-sm"
            aria-describedby="address1-help"
            autoComplete="off"
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => { if (!hasGoogle && suggestions.length > 0) setShowSuggestions(true); }}
          />

          {verified && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Verified
            </span>
          )}

          {!hasGoogle && showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-white border border-[#CECFD3] rounded-lg shadow-lg max-h-60 overflow-auto z-50">
              {suggestions.map((item, idx) => (
                <li key={item.place_id || item.osm_id || idx}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFallbackSelect(item)}
                    className="w-full text-left px-3 py-2 hover:bg-[#F5F6F7] text-sm text-[#0C0F24]"
                  >
                    {item.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="w-full mt-4 max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold max-md:max-w-full text-sm">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
          placeholder="Apartment, suite, unit, building, etc"
          className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent"
        />
      </div>

      <div className="w-full mt-4 max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold leading-6 max-md:max-w-full text-sm">
          City
          <span className="text-[#A91616]">*</span>
        </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="City"
            required
            className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent"
          />
      </div>

      <div className="flex w-full gap-3 flex-wrap mt-4 max-md:flex-col max-md:gap-4">
        <div className="min-w-60 flex-1 shrink basis-[0%] max-md:min-w-full">
          <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold leading-6 max-md:max-w-full text-sm">
            State
            <span className="text-[#A91616]">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
              className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent appearance-none"
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
              <option value="DC">District of Columbia</option>
            </select>
            <img
              src="https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/1cd02bce6337600c23f86f2c759cc0582eb832cd?placeholderIfAbsent=true"
              alt=""
              className="aspect-[1] object-contain w-6 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        <div className="min-w-60 flex-1 shrink basis-[0%] max-md:min-w-full">
          <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold leading-6 max-md:max-w-full text-sm">
            Zip code
            <span className="text-[#A91616]">*</span>
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="12345"
            required
            pattern="[0-9]{5}(-[0-9]{4})?"
            className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Sticky Action Bar - Minimized */}
      <div className="sticky bottom-0 bg-white border-t border-border py-2 px-4 mt-4 max-md:p-2 max-md:mt-2">
        <div className="flex gap-3 max-md:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveResume}
            aria-label="Save and resume application later"
            className="flex-1 max-md:text-sm"
          >
            Save & Resume Later
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleContinue}
            disabled={!canContinue}
            aria-label="Continue to next step"
            className="flex-1 max-md:text-sm"
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
};

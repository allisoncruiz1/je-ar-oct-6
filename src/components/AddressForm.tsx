import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { getCityStateFromZip } from '@/utils/zipCodeData';
import { Check } from 'lucide-react';

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
  initialData?: AddressFormData;
  onFormDataChange?: (data: AddressFormData) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onContinue, onFormValidChange, onSaveResume, initialData, onFormDataChange }) => {
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

  const parseNominatimAddress = (addr: any) => {
    const house = addr.house_number || '';
    const road = addr.road || addr.pedestrian || addr.cycleway || addr.footway || '';
    const line1 = `${house} ${road}`.trim();
    const line2 = addr.suburb || addr.neighbourhood || addr.residential || addr.hamlet || '';
    return {
      addressLine1: line1,
      addressLine2: line2,
      city: addr.city || addr.town || addr.village || addr.hamlet || '',
      state: addr.state_code || addr.state || '',
      zipCode: addr.postcode || '',
    };
  };

  // Handle autocomplete selection (Google or fallback)
  const handlePlaceSelected = useCallback((result: any) => {
    setIsAutocompleting(true);
    const newData = {
      addressLine1: result.addressLine1,
      addressLine2: result.addressLine2,
      city: result.city,
      state: result.state,
      zipCode: result.zipCode,
    };
    setFormData(newData);
    onFormDataChange?.(newData);
    setVerified(true);
    setShowSuggestions(false);
    
    // Reset autocompleting flag after a brief delay to prevent cascade
    setTimeout(() => setIsAutocompleting(false), 100);
  }, [onFormDataChange]);

  useAddressAutocomplete(addressInputRef, handlePlaceSelected);

  const searchFallbackSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setShowSuggestions(true);
    } catch (e) {
      console.error('Fallback address search failed', e);
    }
  };

  const handleFallbackSelect = (item: any) => {
    const parsed = parseNominatimAddress(item.address);
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
    // Don't notify during autocomplete to prevent cascade progression
    if (!isAutocompleting) {
      onFormValidChange?.(isFormComplete);
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
    <form onSubmit={handleSubmit} className="w-full text-base mt-3 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-[#0c0f24] font-semibold leading-6 max-md:max-w-full">
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
            className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent"
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
        <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold max-md:max-w-full">
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
        <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold leading-6 max-md:max-w-full">
          City
          <span className="text-[#A91616]">*</span>
        </label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="Your City"
          required
          className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent"
        />
      </div>

      <div className="flex w-full gap-3 flex-wrap mt-4 max-md:flex-col max-md:gap-4">
        <div className="min-w-60 flex-1 shrink basis-[0%] max-md:min-w-full">
          <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold leading-6 max-md:max-w-full">
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
            </select>
            <img
              src="https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/1cd02bce6337600c23f86f2c759cc0582eb832cd?placeholderIfAbsent=true"
              alt=""
              className="aspect-[1] object-contain w-6 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        <div className="min-w-60 flex-1 shrink basis-[0%] max-md:min-w-full">
          <label className="flex w-full items-center gap-1 text-[#0C0F24] font-semibold leading-6 max-md:max-w-full">
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

    </form>
  );
};

import React, { useState, useEffect } from 'react';

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

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    const newData = { ...formData, [field]: value };
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
    onFormValidChange?.(isFormComplete);
  }, [isFormComplete, onFormValidChange]);

  useEffect(() => {
    const logWidth = () => console.log("AddressForm mounted/rendered. viewport:", window.innerWidth);
    logWidth();
    window.addEventListener("resize", logWidth);
    return () => window.removeEventListener("resize", logWidth);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full text-base mt-3 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <label className="flex w-full items-center gap-1 text-[#0c0f24] font-semibold leading-6 max-md:max-w-full">
          Address Line 1
          <span className="text-[#A91616]">*</span>
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => handleInputChange('addressLine1', e.target.value)}
          placeholder="Street Address"
          required
          className="justify-center items-center border flex w-full gap-2 text-[#858791] font-normal bg-white mt-1 p-3 rounded-lg border-solid border-[#CECFD3] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-[#1B489B] focus:border-transparent"
          aria-describedby="address1-help"
        />
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

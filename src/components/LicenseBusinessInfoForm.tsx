import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HelpCircle, Check, ChevronsUpDown, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
];

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium',
  'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
  'Denmark', 'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'South Korea', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia',
  'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland',
  'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'Vietnam', 'Other'
];

interface LicenseBusinessData {
  preferredName: string;
  isLicensed: string;
  licensedStates: string[];
  conductBusinessOutsideUS: string;
  internationalCountries: string[];
}

interface LicenseBusinessInfoFormProps {
  onSubmit?: (data: LicenseBusinessData) => void;
  onContinue?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  canContinue?: boolean;
  showBack?: boolean;
  initialData?: LicenseBusinessData;
  onFormDataChange?: (data: LicenseBusinessData) => void;
}

export const LicenseBusinessInfoForm: React.FC<LicenseBusinessInfoFormProps> = ({
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
  const [formData, setFormData] = useState<LicenseBusinessData>({
    preferredName: initialData?.preferredName || '',
    isLicensed: initialData?.isLicensed || '',
    licensedStates: initialData?.licensedStates || [],
    conductBusinessOutsideUS: initialData?.conductBusinessOutsideUS || '',
    internationalCountries: initialData?.internationalCountries || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isLicensed) {
      newErrors.isLicensed = 'Please select whether you are currently licensed';
    }

    if (formData.isLicensed === 'yes' && formData.licensedStates.length === 0) {
      newErrors.licensedStates = 'Please select at least one state where you are licensed';
    }

    if (!formData.conductBusinessOutsideUS) {
      newErrors.conductBusinessOutsideUS = 'Please select whether you conduct business outside the US';
    }

    if (formData.conductBusinessOutsideUS === 'yes' && formData.internationalCountries.length === 0) {
      newErrors.internationalCountries = 'Please select at least one country where you conduct business';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const baseValid = !!(formData.isLicensed && formData.conductBusinessOutsideUS);
    let additionalValid = true;
    
    if (formData.isLicensed === 'yes') {
      additionalValid = additionalValid && formData.licensedStates.length > 0;
    }
    
    if (formData.conductBusinessOutsideUS === 'yes') {
      additionalValid = additionalValid && formData.internationalCountries.length > 0;
    }
    
    return baseValid && additionalValid;
  };

  useEffect(() => {
    onFormValidChange?.(isFormValid());
  }, [formData, onFormValidChange]);

  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  const updateFormData = (updates: Partial<LicenseBusinessData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
      onContinue?.();
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Preferred Name Field */}
        <div className="w-full">
          <Label htmlFor="preferredName" className="text-sm font-medium text-[#0C0F24] leading-none">
            Preferred Name
          </Label>
          <Input
            id="preferredName"
            type="text"
            value={formData.preferredName}
            onChange={(e) => updateFormData({ preferredName: e.target.value })}
            placeholder="Enter your preferred name (optional)"
            className="mt-2 h-10 text-base md:text-sm placeholder:text-[#858791]"
          />
        </div>

        {/* Real Estate License Section */}
        <div className="w-full space-y-4">
          <h3 className="text-lg font-semibold text-[#0C0F24] leading-none">
            Real Estate License
          </h3>
          
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-sm font-medium text-[#0C0F24] leading-none">
                Are you currently licensed? <span className="text-[#A91616]">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-[#858791] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select whether you currently hold a real estate license</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <RadioGroup
              value={formData.isLicensed}
              onValueChange={(value) => updateFormData({ isLicensed: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="licensed-yes" />
                <Label htmlFor="licensed-yes" className="text-sm text-[#0C0F24] cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="licensed-no" />
                <Label htmlFor="licensed-no" className="text-sm text-[#0C0F24] cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
            
            {errors.isLicensed && (
              <p className="text-sm text-[#A91616] mt-1">{errors.isLicensed}</p>
            )}
          </div>

          {/* Licensed States Selection - Conditional */}
          {formData.isLicensed === 'yes' && (
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Label className="text-sm font-medium text-[#0C0F24] leading-none">
                  What state(s) are you currently licensed in? <span className="text-[#A91616]">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-[#858791] cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select all states where you currently hold a real estate license</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={`w-full h-10 justify-between text-left font-normal ${
                      formData.licensedStates.length === 0 ? 'text-[#858791]' : 'text-[#0C0F24]'
                    }`}
                  >
                    {formData.licensedStates.length === 0
                      ? 'Select state(s)...'
                      : `${formData.licensedStates.length} state(s) selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search states..." />
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        {US_STATES.map((state) => (
                          <CommandItem
                            key={state}
                            onSelect={() => {
                              const isSelected = formData.licensedStates.includes(state);
                              const newStates = isSelected
                                ? formData.licensedStates.filter(s => s !== state)
                                : [...formData.licensedStates, state];
                              updateFormData({ licensedStates: newStates });
                            }}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={formData.licensedStates.includes(state)}
                              className="h-4 w-4"
                            />
                            <span>{state}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected States Display */}
              {formData.licensedStates.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.licensedStates.map((state) => (
                    <Badge
                      key={state}
                      variant="secondary"
                      className="text-xs px-2 py-1 flex items-center gap-1"
                    >
                      {state}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-[#A91616]"
                        onClick={() => {
                          const newStates = formData.licensedStates.filter(s => s !== state);
                          updateFormData({ licensedStates: newStates });
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.licensedStates && (
                <p className="text-sm text-[#A91616] mt-1">{errors.licensedStates}</p>
              )}
            </div>
          )}
        </div>

        {/* International Business Section */}
        <div className="w-full space-y-4">
          <h3 className="text-lg font-semibold text-[#0C0F24] leading-none">
            International Business
          </h3>
          
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-sm font-medium text-[#0C0F24] leading-none">
                Do you conduct business outside US? <span className="text-[#A91616]">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-[#858791] cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select whether you conduct any business activities outside the United States</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <RadioGroup
              value={formData.conductBusinessOutsideUS}
              onValueChange={(value) => updateFormData({ conductBusinessOutsideUS: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="international-yes" />
                <Label htmlFor="international-yes" className="text-sm text-[#0C0F24] cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="international-no" />
                <Label htmlFor="international-no" className="text-sm text-[#0C0F24] cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
            
            {errors.conductBusinessOutsideUS && (
              <p className="text-sm text-[#A91616] mt-1">{errors.conductBusinessOutsideUS}</p>
            )}
          </div>

          {/* International Countries Selection - Conditional */}
          {formData.conductBusinessOutsideUS === 'yes' && (
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Label className="text-sm font-medium text-[#0C0F24] leading-none">
                  Where? <span className="text-[#A91616]">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-[#858791] cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select all countries where you conduct business activities</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={`w-full h-10 justify-between text-left font-normal ${
                      formData.internationalCountries.length === 0 ? 'text-[#858791]' : 'text-[#0C0F24]'
                    }`}
                  >
                    {formData.internationalCountries.length === 0
                      ? 'Select country(ies)...'
                      : `${formData.internationalCountries.length} country(ies) selected`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        {COUNTRIES.map((country) => (
                          <CommandItem
                            key={country}
                            onSelect={() => {
                              const isSelected = formData.internationalCountries.includes(country);
                              const newCountries = isSelected
                                ? formData.internationalCountries.filter(c => c !== country)
                                : [...formData.internationalCountries, country];
                              updateFormData({ internationalCountries: newCountries });
                            }}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={formData.internationalCountries.includes(country)}
                              className="h-4 w-4"
                            />
                            <span>{country}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Countries Display */}
              {formData.internationalCountries.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.internationalCountries.map((country) => (
                    <Badge
                      key={country}
                      variant="secondary"
                      className="text-xs px-2 py-1 flex items-center gap-1"
                    >
                      {country}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-[#A91616]"
                        onClick={() => {
                          const newCountries = formData.internationalCountries.filter(c => c !== country);
                          updateFormData({ internationalCountries: newCountries });
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.internationalCountries && (
                <p className="text-sm text-[#A91616] mt-1">{errors.internationalCountries}</p>
              )}
            </div>
          )}
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-border p-4 mt-6 max-md:p-3 max-md:mt-4">
          <div className="flex items-center justify-between max-md:flex-col max-md:gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={!showBack}
              aria-label="Go back to previous step"
              className="max-md:order-3 max-md:w-full"
            >
              Back
            </Button>
            <div className="flex gap-3 max-md:w-full max-md:order-1">
              <Button
                variant="outline"
                onClick={onSaveResume}
                aria-label="Save and resume application later"
                className="max-md:flex-1 max-md:text-sm"
              >
                Save & Resume Later
              </Button>
              <Button
                type="submit"
                disabled={!canContinue}
                aria-label="Continue to next step"
                className="max-md:flex-1 max-md:text-sm"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
};
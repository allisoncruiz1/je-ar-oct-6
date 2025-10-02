import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BinaryChoice } from '@/components/ui/binary-choice';
import { MobileMultiSelect } from '@/components/ui/mobile-multi-select';
import { HelpCircle, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useAutoScroll } from '@/hooks/useAutoScroll';
const US_STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'];
const COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'South Korea', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Vietnam', 'Other'];
interface LicenseBusinessData {
  preferredName: string;
  isLicensed: string;
  licensedStates: string[];
  plannedLicenseStates: string[];
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
  continueButtonText?: string;
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
  onFormDataChange,
  continueButtonText = "Continue"
}) => {
  const [formData, setFormData] = useState<LicenseBusinessData>({
    preferredName: initialData?.preferredName || '',
    isLicensed: initialData?.isLicensed || '',
    licensedStates: initialData?.licensedStates || [],
    plannedLicenseStates: initialData?.plannedLicenseStates || [],
    conductBusinessOutsideUS: initialData?.conductBusinessOutsideUS || '',
    internationalCountries: initialData?.internationalCountries || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const { setFieldRef, scrollToNextField } = useAutoScroll();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.isLicensed || (formData.isLicensed !== 'yes' && formData.isLicensed !== 'no')) {
      newErrors.isLicensed = 'Please select whether you are currently licensed';
    }
    if (formData.isLicensed === 'yes' && formData.licensedStates.length === 0) {
      newErrors.licensedStates = 'Please select the state where you are licensed';
    }
    if (formData.isLicensed === 'no' && formData.plannedLicenseStates.length === 0) {
      newErrors.plannedLicenseStates = 'Please select where you plan to get licensed';
    }
    if (!formData.conductBusinessOutsideUS || (formData.conductBusinessOutsideUS !== 'yes' && formData.conductBusinessOutsideUS !== 'no')) {
      newErrors.conductBusinessOutsideUS = 'Please select whether you conduct business outside the US';
    }
    if (formData.conductBusinessOutsideUS === 'yes' && formData.internationalCountries.length === 0) {
      newErrors.internationalCountries = 'Please select at least one country where you conduct business';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const isFormValid = () => {
    const baseValid = (formData.isLicensed === 'yes' || formData.isLicensed === 'no') && 
                     (formData.conductBusinessOutsideUS === 'yes' || formData.conductBusinessOutsideUS === 'no');
    let additionalValid = true;
    if (formData.isLicensed === 'yes') {
      additionalValid = additionalValid && formData.licensedStates.length > 0;
    }
    if (formData.isLicensed === 'no') {
      additionalValid = additionalValid && formData.plannedLicenseStates.length > 0;
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
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-[calc(100vh-200px)]">
        <div className="mb-6 mt-8 max-md:mt-2">
          <h2 className="text-xl font-semibold text-foreground">License & Business Info</h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-8 flex-1 pb-24 md:pb-0">
          {/* Preferred Name Field */}
          <div className="w-full space-y-2">
            <Label htmlFor="preferredName" className="text-sm font-medium text-foreground leading-none">
              Preferred Name
            </Label>
            <Input 
              id="preferredName" 
              type="text" 
              value={formData.preferredName} 
              onChange={e => updateFormData({ preferredName: e.target.value })} 
              placeholder="Enter your preferred name (optional)" 
              className="h-12 md:h-10 text-sm placeholder:text-muted-foreground" 
            />
            <p className="text-xs text-muted-foreground">
              We will use this name when contacting you if it's different from your legal first name.
            </p>
          </div>

            {/* Real Estate License Section */}
            <div ref={setFieldRef(0)} className="w-full space-y-6">
              <h3 className="text-base font-semibold text-foreground leading-none">
                Real Estate License
              </h3>
              
              <div className="w-full">
                <BinaryChoice
                  value={formData.isLicensed}
                  onValueChange={value => {
                    updateFormData({ isLicensed: value });
                    if (value === 'yes') scrollToNextField(0);
                    else scrollToNextField(1);
                  }}
                  label="Are you currently licensed?"
                  tooltip="Active licenses only. Select 'No' if inactive or expired."
                  required
                />
                
                {errors.isLicensed && <p className="text-sm text-[#A91616] mt-1">{errors.isLicensed}</p>}
              </div>

              {/* Licensed States Selection - Conditional */}
              {formData.isLicensed === 'yes' && (
                <div ref={setFieldRef(1)} className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-foreground leading-none">
                      What state(s) are you currently licensed in? <span className="text-destructive">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select all states where you currently hold a real estate license</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <MobileMultiSelect
                    options={US_STATES}
                    selectedValues={formData.licensedStates}
                    onSelectionChange={(values) => {
                      updateFormData({ licensedStates: values });
                      if (values.length > 0) scrollToNextField(1);
                    }}
                    placeholder="Select state(s)..."
                    searchPlaceholder="Search states..."
                  />

                  
                  {errors.licensedStates && (
                    <p className="text-sm text-destructive">{errors.licensedStates}</p>
                  )}
                </div>
              )}

              {/* Planned License States Selection - Conditional for "No" */}
              {formData.isLicensed === 'no' && (
                <div ref={setFieldRef(1)} className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-foreground leading-none">
                      Where do you plan to get licensed? <span className="text-destructive">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select all states where you plan to obtain a real estate license</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <MobileMultiSelect
                    options={US_STATES}
                    selectedValues={formData.plannedLicenseStates}
                    onSelectionChange={(values) => {
                      updateFormData({ plannedLicenseStates: values });
                      if (values.length > 0) scrollToNextField(1);
                    }}
                    placeholder="Select state(s)..."
                    searchPlaceholder="Search states..."
                  />

                  
                  {errors.plannedLicenseStates && (
                    <p className="text-sm text-destructive">{errors.plannedLicenseStates}</p>
                  )}
                </div>
              )}
            </div>

            {/* International Business Section */}
            <div ref={setFieldRef(2)} className="w-full space-y-6">
              <h3 className="text-base font-semibold text-foreground leading-none">
                International Business
              </h3>
              
              <div className="w-full">
                <BinaryChoice
                  value={formData.conductBusinessOutsideUS}
                  onValueChange={value => {
                    updateFormData({ conductBusinessOutsideUS: value });
                    if (value === 'yes') scrollToNextField(2);
                  }}
                  label="Do you conduct business outside US?"
                  tooltip="Select whether you conduct any business activities outside the United States"
                  required
                />
                
                {errors.conductBusinessOutsideUS && <p className="text-sm text-[#A91616] mt-1">{errors.conductBusinessOutsideUS}</p>}
              </div>

              {/* International Countries Selection - Conditional */}
              {formData.conductBusinessOutsideUS === 'yes' && (
                <div ref={setFieldRef(3)} className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-foreground leading-none">
                      Where? <span className="text-destructive">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select all countries where you conduct business activities</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <MobileMultiSelect
                    options={COUNTRIES}
                    selectedValues={formData.internationalCountries}
                    onSelectionChange={(values) => updateFormData({ internationalCountries: values })}
                    placeholder="Select country(ies)..."
                    searchPlaceholder="Search countries..."
                  />

                  
                  {errors.internationalCountries && (
                    <p className="text-sm text-destructive">{errors.internationalCountries}</p>
                  )}
                </div>
              )}
            </div>
        </form>

        {/* Action Bar at bottom */}
        <div className="mt-auto bg-background py-2 px-4 max-md:p-2">
      {/* Desktop action bar */}
      <div ref={actionBarRef} className="bg-background border-t border-border p-4 mt-6 max-md:hidden">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveResume}
            aria-label="Save and resume application later"
          >
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Go back to previous step"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={onContinue}
              disabled={!canContinue}
              aria-label="Continue to next step"
            >
              {continueButtonText}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile action bar */}
      <MobileActionBar
        onBack={onBack}
        onContinue={onContinue}
        onSaveResume={onSaveResume}
        canContinue={canContinue}
        showBack={showBack}
        continueButtonText={continueButtonText}
      />
        </div>
      </div>
    </TooltipProvider>
  );
};
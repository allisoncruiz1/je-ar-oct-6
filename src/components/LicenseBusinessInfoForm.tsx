import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LicenseBusinessData {
  preferredName: string;
  isLicensed: string;
  conductBusinessOutsideUS: string;
}

interface LicenseBusinessInfoFormProps {
  onSubmit?: (data: LicenseBusinessData) => void;
  onContinue?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  onSaveResume?: () => void;
  initialData?: LicenseBusinessData;
  onFormDataChange?: (data: LicenseBusinessData) => void;
}

export const LicenseBusinessInfoForm: React.FC<LicenseBusinessInfoFormProps> = ({
  onSubmit,
  onContinue,
  onFormValidChange,
  onSaveResume,
  initialData,
  onFormDataChange
}) => {
  const [formData, setFormData] = useState<LicenseBusinessData>({
    preferredName: initialData?.preferredName || '',
    isLicensed: initialData?.isLicensed || '',
    conductBusinessOutsideUS: initialData?.conductBusinessOutsideUS || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isLicensed) {
      newErrors.isLicensed = 'Please select whether you are currently licensed';
    }

    if (!formData.conductBusinessOutsideUS) {
      newErrors.conductBusinessOutsideUS = 'Please select whether you conduct business outside the US';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return !!(formData.isLicensed && formData.conductBusinessOutsideUS);
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
        </div>

        {/* Mobile Submit Button */}
        <div className="md:hidden pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid()}
          >
            Continue
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
};
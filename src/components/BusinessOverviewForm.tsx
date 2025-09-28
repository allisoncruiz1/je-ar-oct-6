import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BinaryChoice } from "@/components/ui/binary-choice";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface BusinessOverviewData {
  ownsBrokerage: string;
  spouseAtDifferentBrokerage: string;
  ownsRealEstateOffice: string;
  preExistingMatters: string[];
  licenseTransferDate: Date | undefined;
}

interface BusinessOverviewFormProps {
  onSubmit?: (data: BusinessOverviewData) => void;
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
  initialData?: Partial<BusinessOverviewData>;
  onFormDataChange?: (data: BusinessOverviewData) => void;
}

const PRE_EXISTING_MATTERS_OPTIONS = [
  "I have past or pending criminal charges or judgments (excluding minor traffic infractions)",
  "I have past or pending lawsuits or disputes related to real estate or a brokerage",
  "I have had issues with a real estate licensing authority that could affect my license",
  "None of the above apply to me"
];

export const BusinessOverviewForm: React.FC<BusinessOverviewFormProps> = ({
  onSubmit,
  onContinue,
  onSaveResume,
  onBack,
  onFormValidChange,
  canContinue,
  showBack,
  initialData,
  onFormDataChange
}) => {
  const [formData, setFormData] = useState<BusinessOverviewData>({
    ownsBrokerage: initialData?.ownsBrokerage || '',
    spouseAtDifferentBrokerage: initialData?.spouseAtDifferentBrokerage || '',
    ownsRealEstateOffice: initialData?.ownsRealEstateOffice || '',
    preExistingMatters: initialData?.preExistingMatters || [],
    licenseTransferDate: initialData?.licenseTransferDate || undefined
  });

  const updateFormData = (field: keyof BusinessOverviewData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormDataChange?.(newData);
  };

  const validateForm = () => {
    const isValid = formData.ownsBrokerage.trim() !== '' &&
                    formData.spouseAtDifferentBrokerage.trim() !== '' &&
                    formData.ownsRealEstateOffice.trim() !== '' &&
                    formData.preExistingMatters.length > 0 &&
                    formData.licenseTransferDate !== undefined;
    return isValid;
  };

  useEffect(() => {
    const isValid = validateForm();
    onFormValidChange(isValid);
  }, [formData, onFormValidChange]);

  const handlePreExistingMatterChange = (value: string, checked: boolean) => {
    let newMatters = [...formData.preExistingMatters];
    
    if (value === "None of the above apply to me") {
      // If "None of the above" is selected, clear all others and set only this one
      if (checked) {
        newMatters = [value];
      } else {
        newMatters = [];
      }
    } else {
      // If any other option is selected, remove "None of the above" if it exists
      newMatters = newMatters.filter(matter => matter !== "None of the above apply to me");
      
      if (checked) {
        newMatters.push(value);
      } else {
        newMatters = newMatters.filter(matter => matter !== value);
      }
    }
    
    updateFormData('preExistingMatters', newMatters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Business Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Please provide information about your current business arrangements and background
        </p>
      </div>

      {/* Own Brokerage */}
      <div className="space-y-3">
        <BinaryChoice
          value={formData.ownsBrokerage}
          onValueChange={(value) => updateFormData('ownsBrokerage', value)}
          label="Do you currently own a real estate brokerage or share interest in another real estate brokerage?"
          required
        />
      </div>

      {/* Spouse at Different Brokerage */}
      <div className="space-y-3">
        <BinaryChoice
          value={formData.spouseAtDifferentBrokerage}
          onValueChange={(value) => updateFormData('spouseAtDifferentBrokerage', value)}
          label="Do you have a spouse or domestic partner that is affiliated with a different brokerage?"
          required
        />
      </div>

      {/* Owns Real Estate Office */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Do you currently own lease, or manage a real estate office in any capacity? <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.ownsRealEstateOffice}
          onValueChange={(value) => updateFormData('ownsRealEstateOffice', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="owns-office-yes" />
            <Label htmlFor="owns-office-yes" className="text-sm">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="owns-office-no" />
            <Label htmlFor="owns-office-no" className="text-sm">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-sure" id="owns-office-not-sure" />
            <Label htmlFor="owns-office-not-sure" className="text-sm">Not Sure/Maybe</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Pre-existing Matters Disclosure */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Pre-existing Matters Disclosure (Choose all that apply) <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-3">
          {PRE_EXISTING_MATTERS_OPTIONS.map((option) => (
            <div key={option} className="flex items-start space-x-2">
              <Checkbox
                id={`pre-existing-${option}`}
                checked={formData.preExistingMatters.includes(option)}
                onCheckedChange={(checked) => handlePreExistingMatterChange(option, checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor={`pre-existing-${option}`} className="text-sm leading-relaxed">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* License Transfer Date */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          When do you plan to transfer your license to eXp Realty? <span className="text-destructive">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.licenseTransferDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.licenseTransferDate ? format(formData.licenseTransferDate, "PPP") : "Select a Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.licenseTransferDate}
              onSelect={(date) => updateFormData('licenseTransferDate', date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sticky Action Bar */}
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
            onClick={onContinue}
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
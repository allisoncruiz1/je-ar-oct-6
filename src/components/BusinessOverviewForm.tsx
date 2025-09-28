import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BinaryChoice } from "@/components/ui/binary-choice";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsTouchDevice } from "@/hooks/use-touch";
import { useIsMobile } from "@/hooks/use-mobile";


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
  const isTouch = useIsTouchDevice();
  const isMobile = useIsMobile();
  const isIOSLike = typeof navigator !== "undefined" && ((/iPad|iPhone|iPod/.test(navigator.userAgent)) || (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1));
  const useNativeDate = isTouch || isMobile || isIOSLike;
  
  const [formData, setFormData] = useState<BusinessOverviewData>({
    ownsBrokerage: initialData?.ownsBrokerage || 'no',
    spouseAtDifferentBrokerage: initialData?.spouseAtDifferentBrokerage || 'no',
    ownsRealEstateOffice: initialData?.ownsRealEstateOffice || '',
    preExistingMatters: initialData?.preExistingMatters || [],
    licenseTransferDate: initialData?.licenseTransferDate || undefined
  });

  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);
  const isMobileLike = isMobile || isTouch;

  // Helper to parse date string to local Date (avoids timezone issues)
  const toLocalDate = (yyyyMmDd: string) => {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };

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

  // Dev-only debug log for date picker detection
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug("Date picker flags", { isTouch, isMobile, isIOSLike, useNativeDate });
    }
  }, [isTouch, isMobile, isIOSLike, useNativeDate]);

  // Normalize today at midnight for calendar disabling
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

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
        {useNativeDate ? (
          <Input
            type="date"
            value={formData.licenseTransferDate ? format(formData.licenseTransferDate, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const dateValue = e.target.value ? toLocalDate(e.target.value) : undefined;
              updateFormData('licenseTransferDate', dateValue);
            }}
            min={format(new Date(), "yyyy-MM-dd")}
            className="w-full h-14 md:h-10 px-4 py-3 text-base md:text-sm rounded-lg"
            aria-label="License transfer date"
            inputMode="numeric"
            pattern="\\d{4}-\\d{2}-\\d{2}"
          />
        ) : isMobileLike ? (
          <>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 md:h-10 justify-start text-left font-normal",
                !formData.licenseTransferDate && "text-muted-foreground"
              )}
              aria-label="Open date picker"
              onClick={() => setIsDateDrawerOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.licenseTransferDate ? format(formData.licenseTransferDate, "PPP") : "Select a Date"}
            </Button>
            <Drawer open={isDateDrawerOpen} onOpenChange={setIsDateDrawerOpen}>
              <DrawerContent className="h-[100dvh] p-0">
                <div className="flex h-full flex-col bg-background">
                  <DrawerHeader className="px-4 py-3 border-b border-border">
                    <DrawerTitle className="text-base">Select date</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex-1 overflow-auto p-3">
                    <Calendar
                      mode="single"
                      selected={formData.licenseTransferDate}
                      onSelect={(date) => updateFormData('licenseTransferDate', date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      disabled={(date) => {
                        const d = new Date(date);
                        d.setHours(0, 0, 0, 0);
                        return d < startOfToday;
                      }}
                    />
                  </div>
                  <div className="px-4 py-3 border-t border-border">
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setIsDateDrawerOpen(false)}>Cancel</Button>
                      <Button className="flex-1" onClick={() => setIsDateDrawerOpen(false)}>Done</Button>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-14 md:h-10 justify-start text-left font-normal",
                  !formData.licenseTransferDate && "text-muted-foreground"
                )}
                aria-label="Open calendar"
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
                disabled={(date) => {
                  const d = new Date(date);
                  d.setHours(0, 0, 0, 0);
                  return d < startOfToday;
                }}
              />
            </PopoverContent>
          </Popover>
        )}
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

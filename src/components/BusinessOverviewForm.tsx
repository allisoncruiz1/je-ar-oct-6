import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BinaryChoice } from "@/components/ui/binary-choice";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsTouchDevice } from "@/hooks/use-touch";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileActionBar } from '@/components/MobileActionBar';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useViewportSticky } from '@/hooks/useViewportSticky';
export interface BusinessOverviewData {
  ownsBrokerage: string;
  spouseAtDifferentBrokerage: string;
  formingDomesticPartnership?: string;
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
const PRE_EXISTING_MATTERS_OPTIONS = ["I have past or pending criminal charges or judgments (excluding minor traffic infractions)", "I have past or pending lawsuits or disputes related to real estate or a brokerage", "I have had issues with a real estate licensing authority that could affect my license", "None of the above apply to me"];
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
  const isIOSLike = typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
  const useNativeDate = isTouch || isMobile || isIOSLike;
  const [formData, setFormData] = useState<BusinessOverviewData>({
    ownsBrokerage: initialData?.ownsBrokerage || '',
    spouseAtDifferentBrokerage: initialData?.spouseAtDifferentBrokerage || '',
    formingDomesticPartnership: initialData?.formingDomesticPartnership || '',
    ownsRealEstateOffice: initialData?.ownsRealEstateOffice || '',
    preExistingMatters: initialData?.preExistingMatters || [],
    licenseTransferDate: initialData?.licenseTransferDate || undefined
  });
  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);
  const isMobileLike = isMobile || isTouch;
  const {
    setFieldRef,
    scrollToNextField
  } = useAutoScroll();
  const { isSticky, formRef, actionBarRef } = useViewportSticky();

  // Helper to parse date string to local Date (avoids timezone issues)
  const toLocalDate = (yyyyMmDd: string) => {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };
  const updateFormData = (field: keyof BusinessOverviewData, value: any) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onFormDataChange?.(newData);
  };
  const validateForm = () => {
    const isValid = formData.ownsBrokerage.trim() !== '' && 
      formData.spouseAtDifferentBrokerage.trim() !== '' && 
      // Only require formingDomesticPartnership if spouse is at different brokerage
      (formData.spouseAtDifferentBrokerage !== 'yes' || formData.formingDomesticPartnership?.trim() !== '') &&
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
      console.debug("Date picker flags", {
        isTouch,
        isMobile,
        isIOSLike,
        useNativeDate
      });
    }
  }, [isTouch, isMobile, isIOSLike, useNativeDate]);

  // Normalize today at midnight for calendar disabling
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <form ref={formRef as any} onSubmit={handleSubmit} className="space-y-6 flex-1 pb-24 md:pb-0">
      <div className="mb-6 mt-8">
        <h3 className="font-semibold text-foreground mb-2 text-xl">
          Business Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Please provide information about your current business arrangements and background
        </p>
      </div>

      {/* Own Brokerage */}
      <div ref={setFieldRef(0)} className="space-y-3">
        <BinaryChoice value={formData.ownsBrokerage} onValueChange={value => {
          updateFormData('ownsBrokerage', value);
          scrollToNextField(0);
        }} label="Do you currently own a real estate brokerage or share interest in another real estate brokerage?" required />
      </div>

      {/* Spouse at Different Brokerage */}
      <div ref={setFieldRef(1)} className="space-y-3">
        <BinaryChoice value={formData.spouseAtDifferentBrokerage} onValueChange={value => {
          updateFormData('spouseAtDifferentBrokerage', value);
          // Clear formingDomesticPartnership if changing away from 'yes'
          if (value !== 'yes') {
            updateFormData('formingDomesticPartnership', '');
          }
          scrollToNextField(1);
        }} label="Do you have a spouse or domestic partner that is affiliated with a different brokerage?" required />
      </div>

      {/* Forming Domestic Partnership - Conditional on spouse at different brokerage */}
      {formData.spouseAtDifferentBrokerage === 'yes' && (
        <div ref={setFieldRef(2)} className="space-y-3">
          <BinaryChoice 
            value={formData.formingDomesticPartnership || ''} 
            onValueChange={value => {
              updateFormData('formingDomesticPartnership', value);
              scrollToNextField(2);
            }} 
            label="Do you intend on forming a Domestic Partnership?" 
            required 
          />
        </div>
      )}

      {/* Owns Real Estate Office - Always visible */}
      <div ref={setFieldRef(3)} className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Do you currently own lease, or manage a real estate office in any capacity? <span className="text-destructive">*</span>
        </Label>
        <RadioGroup value={formData.ownsRealEstateOffice} onValueChange={value => {
          updateFormData('ownsRealEstateOffice', value);
          scrollToNextField(3);
        }} className="flex flex-col gap-3 md:flex-row md:gap-6">
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
            <RadioGroupItem value="yes" id="owns-office-yes" className="h-5 w-5" />
            <Label htmlFor="owns-office-yes" className="text-base md:text-sm text-foreground cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
            <RadioGroupItem value="no" id="owns-office-no" className="h-5 w-5" />
            <Label htmlFor="owns-office-no" className="text-base md:text-sm text-foreground cursor-pointer">No</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
            <RadioGroupItem value="not-sure" id="owns-office-not-sure" className="h-5 w-5" />
            <Label htmlFor="owns-office-not-sure" className="text-base md:text-sm text-foreground cursor-pointer">Not Sure/Maybe</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Brick & Mortar Office Information - Conditional on ownsRealEstateOffice === 'yes' */}
      {formData.ownsRealEstateOffice === 'yes' && <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Brick & Mortar Office Information Form
            </h3>
            <p className="text-xs text-muted-foreground">
              Great, please fill out this form to let your Broker Team know and we will be in touch during the onboarding process.
            </p>
          </div>
          <Button type="button" variant="outline" className="w-full h-10 text-sm" onClick={() => {
          // TODO: Open office information form or navigate to external form
          window.open('#', '_blank');
        }}>
            Fill out office Information Form
          </Button>
        </div>}

      {/* Pre-existing Matters Disclosure */}
      <div ref={setFieldRef(4)} className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Pre-existing Matters Disclosure (Choose all that apply) <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-3">
          {PRE_EXISTING_MATTERS_OPTIONS.map(option => <div key={option} className="flex items-start space-x-2">
              <Checkbox id={`pre-existing-${option}`} checked={formData.preExistingMatters.includes(option)} onCheckedChange={checked => {
              handlePreExistingMatterChange(option, checked as boolean);
              if (checked) scrollToNextField(3);
            }} className="mt-0.5" />
              <Label htmlFor={`pre-existing-${option}`} className="text-sm leading-relaxed">
                {option}
              </Label>
            </div>)}
        </div>
      </div>

      {/* License Transfer Date */}
      <div ref={setFieldRef(5)} className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          When do you plan to transfer your license to eXp Realty? <span className="text-destructive">*</span>
        </Label>
        {isMobileLike ? <>
            <Button variant="outline" className={cn("w-full h-14 md:h-10 justify-start text-left font-normal", !formData.licenseTransferDate && "text-muted-foreground")} aria-label="Open date picker" onClick={() => setIsDateDrawerOpen(true)}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.licenseTransferDate ? format(formData.licenseTransferDate, "PPP") : "Select a Date"}
            </Button>
            <Drawer open={isDateDrawerOpen} onOpenChange={setIsDateDrawerOpen}>
              <DrawerContent className="h-[100dvh] p-0 rounded-none">
                <div className="flex h-full flex-col bg-background">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-background">
                    <button onClick={() => setIsDateDrawerOpen(false)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-medium">Select Transfer Date</h2>
                    <button onClick={() => {
                    updateFormData('licenseTransferDate', undefined);
                    setIsDateDrawerOpen(false);
                  }} className="text-sm text-muted-foreground hover:text-foreground px-2 py-1">
                      Clear
                    </button>
                  </div>
                  
                  {/* Calendar */}
                  <div className="flex-1 overflow-auto bg-background">
                    <Calendar mode="single" selected={formData.licenseTransferDate} onSelect={date => updateFormData('licenseTransferDate', date)} initialFocus numberOfMonths={2} className={cn("p-4 pointer-events-auto w-full")} classNames={{
                    months: "flex flex-col space-y-6 w-full",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center text-lg font-medium",
                    caption_label: "text-lg font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md border border-border hover:bg-accent",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm py-2 text-center",
                    row: "flex w-full mt-2",
                    cell: "h-11 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-11 w-full p-0 font-normal text-sm rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground aria-selected:opacity-100",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-medium",
                    day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible"
                  }} disabled={date => {
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    return d < startOfToday;
                  }} />
                  </div>
                  
                  {/* Bottom Action Bar */}
                  <div className="p-4 border-t border-border bg-background">
                    <Button className="w-full h-12 text-base font-medium rounded-xl" onClick={() => setIsDateDrawerOpen(false)} disabled={!formData.licenseTransferDate}>
                      {formData.licenseTransferDate ? 'Save Date' : 'Select a Date'}
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </> : <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full h-14 md:h-10 justify-start text-left font-normal", !formData.licenseTransferDate && "text-muted-foreground")} aria-label="Open calendar">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.licenseTransferDate ? format(formData.licenseTransferDate, "PPP") : "Select a Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={formData.licenseTransferDate} onSelect={date => updateFormData('licenseTransferDate', date)} initialFocus className={cn("p-3 pointer-events-auto")} disabled={date => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d < startOfToday;
            }} />
            </PopoverContent>
          </Popover>}
      </div>

      {/* Action Bar at bottom */}
      </form>
      <div className="mt-auto bg-background py-2 px-4 max-md:p-2">
      {/* Desktop action bar */}
      <div 
        ref={actionBarRef}
        className={cn(
          "bg-background border-t border-border p-4 mt-6 max-md:hidden transition-all",
          isSticky ? "fixed bottom-0 left-0 right-0 shadow-lg z-40" : "relative"
        )}
      >
        <div className={cn("flex items-center justify-between", isSticky && "max-w-[calc(100%-280px)] ml-auto")}>
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
      </div>
    </div>;
};
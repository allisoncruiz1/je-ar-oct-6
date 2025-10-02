import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BinaryChoice } from "@/components/ui/binary-choice";
import { MobileMultiSelect } from "@/components/ui/mobile-multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileActionBar } from '@/components/MobileActionBar';
import { useAutoScroll } from '@/hooks/useAutoScroll';
export interface LicenseDetailsData {
  [state: string]: {
    licenseNumber: string;
    salesTransactions: string;
    pendingTransactions: string;
    existingTransactionsCount?: string;
    associations: string[];
    primaryAssociation?: string;
    mls: string[];
    certifiedMentor: string;
    selectedMentor?: string;
  };
}
interface LicenseDetailsFormProps {
  licensedStates: string[];
  data: LicenseDetailsData;
  onDataChange: (data: LicenseDetailsData) => void;
  onFormValidChange: (isValid: boolean) => void;
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  canContinue?: boolean;
  showBack?: boolean;
}
const ASSOCIATIONS = ["National Association of REALTORS® (NAR)", "Real Estate Buyer's Agent Council (REBAC)", "CCIM Institute", "Institute of Real Estate Management (IREM)", "Women's Council of REALTORS® (WCR)", "Commercial Real Estate Development Association (NAIOP)", "Counselors of Real Estate (CRE)", "Society of Industrial and Office REALTORS® (SIOR)", "Real Estate Securities and Syndication Institute (RESSI)", "Certified Commercial Investment Member (CCIM)", "Other"];
const MLS_OPTIONS = ["Multiple Listing Service (MLS)", "Bright MLS", "California Regional MLS (CRMLS)", "Houston Association of REALTORS® (HAR)", "Miami Association of REALTORS® (MIAMI)", "TREND MLS", "Northeast Florida Association of REALTORS® (NEFAR)", "Triangle MLS", "Denver Metro Association of REALTORS® (DMAR)", "Greater Las Vegas Association of REALTORS® (GLVAR)", "Other"];
const MENTOR_OPTIONS = ["John Smith - Residential Specialist", "Sarah Johnson - Commercial Expert", "Mike Davis - New Agent Mentor", "Lisa Brown - Luxury Market Specialist", "David Wilson - Investment Property Expert", "No preference - Assign me a mentor"];
export const LicenseDetailsForm: React.FC<LicenseDetailsFormProps> = ({
  licensedStates,
  data,
  onDataChange,
  onFormValidChange,
  onContinue,
  onSaveResume,
  onBack,
  canContinue,
  showBack
 }) => {
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
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const currentState = licensedStates[currentStateIndex];
  const {
    setFieldRef,
    scrollToNextField
  } = useAutoScroll();
  console.log('🏠 LicenseDetailsForm state debug:', {
    licensedStates,
    currentStateIndex,
    currentState
  });
  const currentData = data[currentState] || {
    licenseNumber: '',
    salesTransactions: '',
    pendingTransactions: '',
    existingTransactionsCount: '',
    associations: [],
    primaryAssociation: '',
    mls: [],
    certifiedMentor: '',
    selectedMentor: ''
  };
  const updateCurrentStateData = (field: string, value: any) => {
    const newData = {
      ...data,
      [currentState]: {
        ...currentData,
        [field]: value
      }
    };
    console.log('🧩 LicenseDetailsForm update', { field, value, currentState, newState: newData[currentState] });
    onDataChange(newData);

    // Check if current state is valid (allow continuing with partial data)
    const currentStateData = newData[currentState];
    const salesCount = parseInt(currentStateData?.salesTransactions || '0');
    const showMentorProgram = salesCount === 2;

    // Base validation - mentor field only required if sales <= 2
    const baseValid = !!(currentStateData?.licenseNumber?.trim() && currentStateData?.salesTransactions?.trim() && currentStateData?.pendingTransactions?.trim() && currentStateData?.mls?.length > 0 && (showMentorProgram ? currentStateData?.certifiedMentor === 'yes' || currentStateData?.certifiedMentor === 'no' : true));

    // If pending transactions is "yes", also require existing transactions count
    const pendingValid = currentStateData?.pendingTransactions !== 'yes' || !!currentStateData?.existingTransactionsCount?.trim();

    // If certified mentor is "yes" AND mentor program is shown, also require selected mentor
    const mentorValid = !showMentorProgram || currentStateData?.certifiedMentor !== 'yes' || !!currentStateData?.selectedMentor?.trim();
    
    // If multiple associations are selected, require primary association
    const primaryAssociationValid = currentStateData?.associations?.length <= 1 || !!currentStateData?.primaryAssociation?.trim();
    
    const isCurrentStateValid = baseValid && pendingValid && mentorValid && primaryAssociationValid;
    console.log('🔍 LicenseDetailsForm validation:', {
      currentState,
      baseValid,
      pendingValid,
      mentorValid,
      isCurrentStateValid,
      licenseNumber: currentStateData?.licenseNumber,
      salesTransactions: currentStateData?.salesTransactions,
      pendingTransactions: currentStateData?.pendingTransactions,
      associationsLength: currentStateData?.associations?.length,
      primaryAssociation: currentStateData?.primaryAssociation,
      mlsLength: currentStateData?.mls?.length,
      certifiedMentor: currentStateData?.certifiedMentor
    });
    onFormValidChange(isCurrentStateValid);
  };

  // Batch updater to avoid stale overwrites when multiple fields must change together
  const updateCurrentStateDataBatch = (patch: Partial<typeof currentData>) => {
    const newData = {
      ...data,
      [currentState]: {
        ...currentData,
        ...patch,
      },
    };
    console.log('🧩 LicenseDetailsForm update (batch)', { patch, currentState, newState: newData[currentState] });
    onDataChange(newData);

    // Re-run validation with the updated state
    const currentStateData = newData[currentState];
    const salesCount = parseInt(currentStateData?.salesTransactions || '0');
    const showMentorProgram = salesCount === 2;

    const baseValid = !!(currentStateData?.licenseNumber?.trim() && currentStateData?.salesTransactions?.trim() && currentStateData?.pendingTransactions?.trim() && currentStateData?.mls?.length > 0 && (showMentorProgram ? currentStateData?.certifiedMentor === 'yes' || currentStateData?.certifiedMentor === 'no' : true));
    const pendingValid = currentStateData?.pendingTransactions !== 'yes' || !!currentStateData?.existingTransactionsCount?.trim();
    const mentorValid = !showMentorProgram || currentStateData?.certifiedMentor !== 'yes' || !!currentStateData?.selectedMentor?.trim();
    const primaryAssociationValid = currentStateData?.associations?.length <= 1 || !!currentStateData?.primaryAssociation?.trim();

    const isCurrentStateValid = baseValid && pendingValid && mentorValid && primaryAssociationValid;
    console.log('🔍 LicenseDetailsForm validation:', {
      currentState,
      baseValid,
      pendingValid,
      mentorValid,
      isCurrentStateValid,
      licenseNumber: currentStateData?.licenseNumber,
      salesTransactions: currentStateData?.salesTransactions,
      pendingTransactions: currentStateData?.pendingTransactions,
      associationsLength: currentStateData?.associations?.length,
      primaryAssociation: currentStateData?.primaryAssociation,
      mlsLength: currentStateData?.mls?.length,
      certifiedMentor: currentStateData?.certifiedMentor
    });
    onFormValidChange(isCurrentStateValid);
  };
  const canGoNext = () => currentStateIndex < licensedStates.length - 1;
  const canGoPrevious = () => currentStateIndex > 0;
  return <div className="space-y-6 pb-24 md:pb-0">
      {/* State Navigation Header */}
      {licensedStates.length > 1 && <div className="flex items-center justify-between mb-6">
          
        </div>}

      {/* Current State Header */}
      <div className="mb-6 mt-8 max-md:mt-2">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {currentState} License Details
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentStateIndex + 1}/{licensedStates.length} Licensed States
        </p>
      </div>

      {/* License Number */}
      <div ref={setFieldRef(0)} className="space-y-2">
        <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground">
          License Number <span className="text-destructive">*</span>
        </Label>
        <Input id="licenseNumber" type="text" value={currentData.licenseNumber} onChange={e => updateCurrentStateData('licenseNumber', e.target.value)} onBlur={() => {
        if (currentData.licenseNumber.trim()) scrollToNextField(0);
      }} placeholder="Enter your license number" className="w-full" />
      </div>

      {/* Sales Transactions */}
      <div ref={setFieldRef(1)} className="space-y-2">
        <Label htmlFor="salesTransactions" className="text-sm font-medium text-foreground">
          Sales Transactions (Past 12 Months) <span className="text-destructive">*</span>
        </Label>
        <Input id="salesTransactions" type="number" value={currentData.salesTransactions} onChange={e => updateCurrentStateData('salesTransactions', e.target.value)} onBlur={() => {
        if (currentData.salesTransactions.trim()) scrollToNextField(1);
      }} placeholder="Number of transactions" className="w-full" min="0" />
      </div>

      {/* Certified Mentor Program - Only show if sales transactions are exactly 2 */}
      {currentData.salesTransactions === '2' && <div ref={setFieldRef(2)} className="space-y-3">
        <BinaryChoice value={currentData.certifiedMentor} onValueChange={value => {
        updateCurrentStateData('certifiedMentor', value);
        if (value === 'yes') scrollToNextField(2);else scrollToNextField(3);
      }} label="You may qualify for eXp's Certified Mentor Program. Would you like to request a specific certified mentor to guide you through your first few transactions?" required />

        {/* Conditional field for selecting a specific mentor */}
        {currentData.certifiedMentor === 'yes' && <div className="space-y-2 mt-4">
            <Label htmlFor="selectedMentor" className="text-sm font-medium text-foreground">
              Select a certified mentor from <span className="text-destructive">*</span>
            </Label>
            <Select value={currentData.selectedMentor || ''} onValueChange={value => {
          updateCurrentStateData('selectedMentor', value);
          scrollToNextField(3);
        }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a mentor" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {MENTOR_OPTIONS.map(mentor => <SelectItem key={mentor} value={mentor} className="cursor-pointer">
                    {mentor}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>}
      </div>}

      {/* Pending Transactions */}
      <div ref={setFieldRef(3)} className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Do you have any pending transactions or active listings in {currentState} that you plan to bring with you to eXp Realty? <span className="text-destructive">*</span>
        </Label>
        <RadioGroup value={currentData.pendingTransactions} onValueChange={value => {
        updateCurrentStateData('pendingTransactions', value);
        if (value === 'yes') scrollToNextField(3);else scrollToNextField(4);
      }} className="flex flex-col gap-3 md:flex-row md:gap-6">
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
            <RadioGroupItem value="yes" id="pending-yes" className="h-5 w-5" />
            <Label htmlFor="pending-yes" className="text-base md:text-sm text-foreground cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
            <RadioGroupItem value="no" id="pending-no" className="h-5 w-5" />
            <Label htmlFor="pending-no" className="text-base md:text-sm text-foreground cursor-pointer">No</Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
            <RadioGroupItem value="not-sure" id="pending-not-sure" className="h-5 w-5" />
            <Label htmlFor="pending-not-sure" className="text-base md:text-sm text-foreground cursor-pointer">Not Sure Yet</Label>
          </div>
        </RadioGroup>

        {/* Conditional field for existing transactions count */}
        {currentData.pendingTransactions === 'yes' && <div className="space-y-2 mt-4">
            <Label htmlFor="existingTransactionsCount" className="text-sm font-medium text-foreground">
              How many existing transactions or listings do you have? <span className="text-destructive">*</span>
            </Label>
            <Input id="existingTransactionsCount" type="number" value={currentData.existingTransactionsCount || ''} onChange={e => updateCurrentStateData('existingTransactionsCount', e.target.value)} onBlur={() => {
          if (currentData.existingTransactionsCount?.trim()) scrollToNextField(4);
        }} placeholder="Enter the number of transactions/listings" className="w-full" min="0" />
          </div>}
      </div>

      {/* Associations */}
      <div ref={setFieldRef(4)} className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Please select your association(s) you plan to be affiliated with as a real estate agent in {currentState}:
        </Label>
        <MobileMultiSelect
          options={ASSOCIATIONS}
          selectedValues={currentData.associations}
          onSelectionChange={(values) => {
            updateCurrentStateDataBatch({
              associations: values,
              primaryAssociation: values.length <= 1 ? '' : currentData.primaryAssociation,
            });
            if (values.length > 0) scrollToNextField(4);
          }}
          placeholder="Select associations"
          searchPlaceholder="Search associations..."
        />
      </div>

      {/* Primary Association - Only show if multiple associations selected */}
      {currentData.associations.length > 1 && <div className="space-y-2">
          <Label htmlFor="primaryAssociation" className="text-sm font-medium text-foreground">
            Which Association is your Primary? <span className="text-destructive">*</span>
          </Label>
          <Select value={currentData.primaryAssociation || ''} onValueChange={value => {
          updateCurrentStateData('primaryAssociation', value);
          scrollToNextField(5);
        }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select primary association" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg z-50">
              {currentData.associations.map(association => <SelectItem key={association} value={association} className="cursor-pointer">
                  {association}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>}

      {/* MLS */}
      <div ref={setFieldRef(5)} className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Please select your MLS(s) you plan to be affiliated with as a real estate agent in {currentState}: <span className="text-destructive">*</span>
        </Label>
        <MobileMultiSelect options={MLS_OPTIONS} selectedValues={currentData.mls} onSelectionChange={values => updateCurrentStateData('mls', values)} placeholder="Select MLS" searchPlaceholder="Search MLS..." />
      </div>

      {/* Desktop action bar */}
      <div ref={actionBarRef} className="bg-background border-t border-border p-4 mt-10 max-md:hidden">
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
    </div>;
};
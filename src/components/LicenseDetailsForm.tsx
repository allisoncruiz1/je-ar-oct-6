import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BinaryChoice } from "@/components/ui/binary-choice";
import { MobileMultiSelect } from "@/components/ui/mobile-multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LicenseDetailsData {
  [state: string]: {
    licenseNumber: string;
    salesTransactions: string;
    pendingTransactions: string;
    existingTransactionsCount?: string;
    associations: string[];
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

const ASSOCIATIONS = [
  "National Association of REALTORS® (NAR)",
  "Real Estate Buyer's Agent Council (REBAC)",
  "CCIM Institute",
  "Institute of Real Estate Management (IREM)",
  "Women's Council of REALTORS® (WCR)",
  "Commercial Real Estate Development Association (NAIOP)",
  "Counselors of Real Estate (CRE)",
  "Society of Industrial and Office REALTORS® (SIOR)",
  "Real Estate Securities and Syndication Institute (RESSI)",
  "Certified Commercial Investment Member (CCIM)",
  "Other"
];

const MLS_OPTIONS = [
  "Multiple Listing Service (MLS)",
  "Bright MLS",
  "California Regional MLS (CRMLS)",
  "Houston Association of REALTORS® (HAR)",
  "Miami Association of REALTORS® (MIAMI)",
  "TREND MLS",
  "Northeast Florida Association of REALTORS® (NEFAR)",
  "Triangle MLS",
  "Denver Metro Association of REALTORS® (DMAR)",
  "Greater Las Vegas Association of REALTORS® (GLVAR)",
  "Other"
];

const MENTOR_OPTIONS = [
  "John Smith - Residential Specialist",
  "Sarah Johnson - Commercial Expert", 
  "Mike Davis - New Agent Mentor",
  "Lisa Brown - Luxury Market Specialist",
  "David Wilson - Investment Property Expert",
  "No preference - Assign me a mentor"
];

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
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  const currentState = licensedStates[currentStateIndex];
  const currentData = data[currentState] || {
    licenseNumber: '',
    salesTransactions: '',
    pendingTransactions: '',
    existingTransactionsCount: '',
    associations: [],
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
    onDataChange(newData);
    
    // Check if current state is valid (allow continuing with partial data)
    const currentStateData = newData[currentState];
    const baseValid = !!(currentStateData?.licenseNumber?.trim() &&
                     currentStateData?.salesTransactions?.trim() &&
                     currentStateData?.pendingTransactions?.trim() &&
                     currentStateData?.mls?.length > 0 &&
                     (currentStateData?.certifiedMentor === 'yes' || currentStateData?.certifiedMentor === 'no'));
    
    // If pending transactions is "yes", also require existing transactions count
    const pendingValid = currentStateData?.pendingTransactions !== 'yes' || 
                        !!(currentStateData?.existingTransactionsCount?.trim());
    
    // If certified mentor is "yes", also require selected mentor
    const mentorValid = currentStateData?.certifiedMentor !== 'yes' || 
                       !!(currentStateData?.selectedMentor?.trim());
    
    const isCurrentStateValid = baseValid && pendingValid && mentorValid;
    onFormValidChange(isCurrentStateValid);
  };


  const canGoNext = () => currentStateIndex < licensedStates.length - 1;
  const canGoPrevious = () => currentStateIndex > 0;

  return (
    <div className="space-y-6">
      {/* State Navigation Header */}
      {licensedStates.length > 1 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStateIndex(currentStateIndex - 1)}
              disabled={!canGoPrevious()}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous State
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              {currentStateIndex + 1} of {licensedStates.length} Licensed States
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStateIndex(currentStateIndex + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2"
            >
              Next State
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Current State Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          License Details - {currentState}
        </h3>
        <p className="text-sm text-muted-foreground">
          Please provide your license information for {currentState}
        </p>
      </div>

      {/* License Number */}
      <div className="space-y-2">
        <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground">
          License Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="licenseNumber"
          type="text"
          value={currentData.licenseNumber}
          onChange={(e) => updateCurrentStateData('licenseNumber', e.target.value)}
          placeholder="Enter your license number"
          className="w-full"
        />
      </div>

      {/* Sales Transactions */}
      <div className="space-y-2">
        <Label htmlFor="salesTransactions" className="text-sm font-medium text-foreground">
          Sales Transactions (Past 12 Months) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="salesTransactions"
          type="number"
          value={currentData.salesTransactions}
          onChange={(e) => updateCurrentStateData('salesTransactions', e.target.value)}
          placeholder="Number of transactions"
          className="w-full"
          min="0"
        />
      </div>

      {/* Pending Transactions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          Do you have any pending transactions or active listings in {currentState} that you plan to bring with you to eXp Realty? <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={currentData.pendingTransactions}
          onValueChange={(value) => updateCurrentStateData('pendingTransactions', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="pending-yes" />
            <Label htmlFor="pending-yes" className="text-sm">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="pending-no" />
            <Label htmlFor="pending-no" className="text-sm">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-sure" id="pending-not-sure" />
            <Label htmlFor="pending-not-sure" className="text-sm">Not Sure Yet</Label>
          </div>
        </RadioGroup>

        {/* Conditional field for existing transactions count */}
        {currentData.pendingTransactions === 'yes' && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="existingTransactionsCount" className="text-sm font-medium text-foreground">
              How many existing transactions or listings do you have? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="existingTransactionsCount"
              type="number"
              value={currentData.existingTransactionsCount || ''}
              onChange={(e) => updateCurrentStateData('existingTransactionsCount', e.target.value)}
              placeholder="Enter the number of transactions/listings"
              className="w-full"
              min="0"
            />
          </div>
        )}
      </div>

      {/* Associations */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Please select your association(s) you plan to be affiliated with as a real estate agent in {currentState}:
        </Label>
        <MobileMultiSelect
          options={ASSOCIATIONS}
          selectedValues={currentData.associations}
          onSelectionChange={(values) => updateCurrentStateData('associations', values)}
          placeholder="Select associations"
          searchPlaceholder="Search associations..."
        />
      </div>

      {/* MLS */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Please select your MLS(s) you plan to be affiliated with as a real estate agent in {currentState}: <span className="text-destructive">*</span>
        </Label>
        <MobileMultiSelect
          options={MLS_OPTIONS}
          selectedValues={currentData.mls}
          onSelectionChange={(values) => updateCurrentStateData('mls', values)}
          placeholder="Select MLS"
          searchPlaceholder="Search MLS..."
        />
      </div>

      {/* Certified Mentor Program */}
      <div className="space-y-3">
        <BinaryChoice
          value={currentData.certifiedMentor}
          onValueChange={(value) => updateCurrentStateData('certifiedMentor', value)}
          label="You may qualify for eXp's Certified Mentor Program. Would you like to request a specific certified mentor to guide you through your first few transactions?"
          required
        />

        {/* Conditional field for selecting a specific mentor */}
        {currentData.certifiedMentor === 'yes' && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="selectedMentor" className="text-sm font-medium text-foreground">
              Select a certified mentor from <span className="text-destructive">*</span>
            </Label>
            <Select
              value={currentData.selectedMentor || ''}
              onValueChange={(value) => updateCurrentStateData('selectedMentor', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a mentor" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {MENTOR_OPTIONS.map((mentor) => (
                  <SelectItem key={mentor} value={mentor} className="cursor-pointer">
                    {mentor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-border py-4 px-4 mt-4 max-md:p-2 max-md:mt-2">
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-2">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              aria-label="Go back to previous step"
              className="max-md:order-3 max-md:w-full"
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <div className="flex gap-3 max-md:gap-2 max-md:w-full max-md:order-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveResume}
              aria-label="Save and resume application later"
              className="max-md:flex-1 max-md:text-sm"
            >
              Save & Resume Later
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onContinue}
              disabled={!canContinue}
              aria-label="Continue to next step"
              className="max-md:flex-1 max-md:text-sm"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
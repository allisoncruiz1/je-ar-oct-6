import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  };
}

interface LicenseDetailsFormProps {
  licensedStates: string[];
  data: LicenseDetailsData;
  onDataChange: (data: LicenseDetailsData) => void;
  onFormValidChange: (isValid: boolean) => void;
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

export const LicenseDetailsForm: React.FC<LicenseDetailsFormProps> = ({
  licensedStates,
  data,
  onDataChange,
  onFormValidChange
}) => {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [associationsOpen, setAssociationsOpen] = useState(false);
  const [mlsOpen, setMlsOpen] = useState(false);

  const currentState = licensedStates[currentStateIndex];
  const currentData = data[currentState] || {
    licenseNumber: '',
    salesTransactions: '',
    pendingTransactions: '',
    existingTransactionsCount: '',
    associations: [],
    mls: [],
    certifiedMentor: ''
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
    
    // Check if all states are valid
    const isValid = licensedStates.every(state => {
      const stateData = newData[state];
      const baseValid = stateData?.licenseNumber?.trim() &&
                       stateData?.salesTransactions?.trim() &&
                       stateData?.pendingTransactions?.trim() &&
                       stateData?.mls?.length > 0 &&
                       stateData?.certifiedMentor?.trim();
      
      // If pending transactions is "yes", also require existing transactions count
      const pendingValid = stateData?.pendingTransactions !== 'yes' || 
                          (stateData?.existingTransactionsCount?.trim());
      
      return baseValid && pendingValid;
    });
    onFormValidChange(isValid);
  };

  const toggleAssociation = (association: string) => {
    const newAssociations = currentData.associations.includes(association)
      ? currentData.associations.filter(a => a !== association)
      : [...currentData.associations, association];
    updateCurrentStateData('associations', newAssociations);
  };

  const toggleMLS = (mls: string) => {
    const newMLS = currentData.mls.includes(mls)
      ? currentData.mls.filter(m => m !== mls)
      : [...currentData.mls, mls];
    updateCurrentStateData('mls', newMLS);
  };

  const removeAssociation = (association: string) => {
    const newAssociations = currentData.associations.filter(a => a !== association);
    updateCurrentStateData('associations', newAssociations);
  };

  const removeMLS = (mls: string) => {
    const newMLS = currentData.mls.filter(m => m !== mls);
    updateCurrentStateData('mls', newMLS);
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
        <Popover open={associationsOpen} onOpenChange={setAssociationsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={associationsOpen}
              className="w-full justify-between text-left font-normal"
            >
              {currentData.associations.length > 0
                ? `${currentData.associations.length} association(s) selected`
                : "Select associations"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search associations..." className="h-9" />
              <CommandList>
                <CommandEmpty>No associations found.</CommandEmpty>
                <CommandGroup>
                  {ASSOCIATIONS.map((association) => (
                    <CommandItem
                      key={association}
                      onSelect={() => toggleAssociation(association)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={currentData.associations.includes(association)}
                        onChange={() => toggleAssociation(association)}
                      />
                      <span className="flex-1">{association}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Associations */}
        {currentData.associations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {currentData.associations.map((association) => (
              <Badge key={association} variant="secondary" className="flex items-center gap-1">
                {association}
                <button
                  type="button"
                  onClick={() => removeAssociation(association)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* MLS */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Please select your MLS(s) you plan to be affiliated with as a real estate agent in {currentState}: <span className="text-destructive">*</span>
        </Label>
        <Popover open={mlsOpen} onOpenChange={setMlsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={mlsOpen}
              className="w-full justify-between text-left font-normal"
            >
              {currentData.mls.length > 0
                ? `${currentData.mls.length} MLS selected`
                : "Select MLS"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search MLS..." className="h-9" />
              <CommandList>
                <CommandEmpty>No MLS found.</CommandEmpty>
                <CommandGroup>
                  {MLS_OPTIONS.map((mls) => (
                    <CommandItem
                      key={mls}
                      onSelect={() => toggleMLS(mls)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={currentData.mls.includes(mls)}
                        onChange={() => toggleMLS(mls)}
                      />
                      <span className="flex-1">{mls}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected MLS */}
        {currentData.mls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {currentData.mls.map((mls) => (
              <Badge key={mls} variant="secondary" className="flex items-center gap-1">
                {mls}
                <button
                  type="button"
                  onClick={() => removeMLS(mls)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Certified Mentor Program */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          You may qualify for eXp's Certified Mentor Program. Would you like to request a specific certified mentor to guide you through your first few transactions? <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={currentData.certifiedMentor}
          onValueChange={(value) => updateCurrentStateData('certifiedMentor', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="mentor-yes" />
            <Label htmlFor="mentor-yes" className="text-sm">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="mentor-no" />
            <Label htmlFor="mentor-no" className="text-sm">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
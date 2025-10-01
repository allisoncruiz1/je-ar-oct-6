import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { z } from 'zod';
import { MobileActionBar } from '@/components/MobileActionBar';

export interface TeamFunctionData {
  agentType: string;
  corporateStaffMember: string;
}

interface TeamFunctionFormProps {
  onSubmit?: (data: TeamFunctionData) => void;
  onContinue?: () => void;
  onSaveResume?: () => void;
  onBack?: () => void;
  onFormValidChange: (isValid: boolean) => void;
  canContinue?: boolean;
  showBack?: boolean;
  initialData?: Partial<TeamFunctionData>;
  onFormDataChange?: (data: TeamFunctionData) => void;
}

// Validation schema
const teamFunctionSchema = z.object({
  agentType: z.string().trim().nonempty({ message: "Please select how you'll work at eXp" }),
  corporateStaffMember: z.string().trim().nonempty({ message: "Please indicate if you're a corporate staff member" })
});

export const TeamFunctionForm: React.FC<TeamFunctionFormProps> = ({
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
  const [formData, setFormData] = useState<TeamFunctionData>({
    agentType: initialData?.agentType || '',
    corporateStaffMember: initialData?.corporateStaffMember || ''
  });

  const updateFormData = (field: keyof TeamFunctionData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormDataChange?.(newData);
  };

  const validateForm = () => {
    try {
      teamFunctionSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const isValid = validateForm();
    onFormValidChange(isValid);
  }, [formData, onFormValidChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            How you'll run your business at eXp
          </h3>
          <p className="text-sm text-muted-foreground">
            Please tell us about your planned business structure and staff status
          </p>
        </div>

        {/* Agent Type Question */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-foreground">
              Will you be selling real estate with eXp as an individual agent or as part of a team? <span className="text-destructive">*</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    Individual agents work independently, while team members collaborate with other agents under a team structure.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup
            value={formData.agentType}
            onValueChange={(value) => updateFormData('agentType', value)}
            className="mt-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="agent-individual" />
              <Label htmlFor="agent-individual" className="text-sm font-normal">
                Individual Agent
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="team" id="agent-team" />
              <Label htmlFor="agent-team" className="text-sm font-normal">
                Part of a team
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Corporate Staff Member Question */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Are you an eXp realty Corporate Staff member? <span className="text-destructive">*</span>
          </Label>
          <ToggleGroup
            type="single"
            value={formData.corporateStaffMember}
            onValueChange={(value) => value && updateFormData('corporateStaffMember', value)}
            className="flex flex-col items-start gap-2 mt-3"
          >
            <ToggleGroupItem 
              value="yes" 
              aria-label="Yes"
              className="w-full justify-start h-auto p-4 text-left data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              Yes
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="no" 
              aria-label="No"
              className="w-full justify-start h-auto p-4 text-left data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              No
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </form>

      {/* Desktop action bar */}
      <div className="mt-auto bg-white border-t border-border py-2 px-4 max-md:hidden">
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
              Continue
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile action bar */}
      <MobileActionBar
        onBack={onBack}
        onContinue={onContinue}
        canContinue={canContinue}
        showBack={showBack}
      />
    </div>
  );
};
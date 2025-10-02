import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, Check, ChevronsUpDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { z } from 'zod';
import { MobileActionBar } from '@/components/MobileActionBar';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface TeamFunctionData {
  agentType: string;
  teamRole?: string;
  teamName?: string;
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

// Mock data for teams - in production, this would come from an API
const mockTeams = [
  { value: "team-1", label: "The Innovators - John Smith" },
  { value: "team-2", label: "Elite Realty Group - Sarah Johnson" },
  { value: "team-3", label: "Premier Partners - Mike Davis" },
  { value: "team-4", label: "Summit Sellers - Lisa Anderson" },
  { value: "team-5", label: "Apex Agents - Robert Wilson" },
  { value: "cant-find", label: "Can't find the team" },
];

// Validation schema
const teamFunctionSchema = z.object({
  agentType: z.string().trim().nonempty({ message: "Please select how you'll work at eXp" }),
  teamRole: z.string().optional(),
  teamName: z.string().optional(),
  corporateStaffMember: z.string().trim().nonempty({ message: "Please indicate if you're a corporate staff member" })
}).refine((data) => {
  if (data.agentType === 'team') {
    return data.teamRole && data.teamRole.trim() !== '';
  }
  return true;
}, {
  message: "Please select your role within the team",
  path: ["teamRole"]
}).refine((data) => {
  if (data.teamRole === 'member') {
    return data.teamName && data.teamName.trim() !== '';
  }
  return true;
}, {
  message: "Please select which team you're joining",
  path: ["teamName"]
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
    teamRole: initialData?.teamRole || '',
    teamName: initialData?.teamName || '',
    corporateStaffMember: initialData?.corporateStaffMember || ''
  });
  const [open, setOpen] = useState(false);
  const { setFieldRef, scrollToNextField } = useAutoScroll();

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
        <div ref={setFieldRef(0)} className="space-y-3">
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
            onValueChange={(value) => {
              updateFormData('agentType', value);
              scrollToNextField(0);
            }}
            className="flex gap-3 mt-3 md:gap-6"
          >
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="individual" id="agent-individual" className="h-5 w-5" />
              <Label htmlFor="agent-individual" className="text-base md:text-sm text-foreground cursor-pointer md:font-normal">
                Individual Agent
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="team" id="agent-team" className="h-5 w-5" />
              <Label htmlFor="agent-team" className="text-base md:text-sm text-foreground cursor-pointer md:font-normal">
                Part of a team
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Team Role Question - Conditional */}
        {formData.agentType === 'team' && (
          <div ref={setFieldRef(1)} className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-foreground">
                What's your role within the team? <span className="text-destructive">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Team Members work under a Team Leader who manages the team's operations and growth.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <RadioGroup
              value={formData.teamRole}
              onValueChange={(value) => {
                updateFormData('teamRole', value);
                scrollToNextField(1);
              }}
              className="flex gap-3 mt-3 md:gap-6"
            >
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
                <RadioGroupItem value="member" id="role-member" className="h-5 w-5" />
                <Label htmlFor="role-member" className="text-base md:text-sm text-foreground cursor-pointer md:font-normal">
                  Team Member
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
                <RadioGroupItem value="leader" id="role-leader" className="h-5 w-5" />
                <Label htmlFor="role-leader" className="text-base md:text-sm text-foreground cursor-pointer md:font-normal">
                  Leader
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Team Selection - Conditional on Team Member */}
        {formData.teamRole === 'member' && (
          <div ref={setFieldRef(2)} className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Which of our rockstar teams are you planning on joining? <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Here's a list of active teams. Let's try to select which team you are joining by searching for Team name or Team Leader.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Note: If you can't find it, that's ok, we will still capture these details for you.
            </p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-12 text-base md:text-sm md:h-10 bg-background"
                >
                  {formData.teamName
                    ? mockTeams.find((team) => team.value === formData.teamName)?.label
                    : "Search by team name, leader, state or city..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-popover" align="start">
                <Command>
                  <CommandInput placeholder="Search teams..." className="h-12 md:h-9" />
                  <CommandList>
                    <CommandEmpty>No team found.</CommandEmpty>
                    <CommandGroup>
                      {mockTeams.map((team) => (
                        <CommandItem
                          key={team.value}
                          value={team.value}
                          onSelect={(currentValue) => {
                            updateFormData('teamName', currentValue === formData.teamName ? '' : currentValue);
                            setOpen(false);
                            scrollToNextField(2);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.teamName === team.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {team.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Corporate Staff Member Question */}
        <div ref={setFieldRef(formData.teamRole === 'member' ? 3 : formData.agentType === 'team' ? 2 : 1)} className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Are you an eXp realty Corporate Staff member? <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.corporateStaffMember}
            onValueChange={(value) => updateFormData('corporateStaffMember', value)}
            className="flex gap-3 mt-3 md:gap-6"
          >
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="yes" id="staff-yes" className="h-5 w-5" />
              <Label htmlFor="staff-yes" className="text-base md:text-sm text-foreground cursor-pointer md:font-normal">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14 flex-1 md:h-auto md:bg-transparent md:p-0 md:space-x-2 md:flex-none">
              <RadioGroupItem value="no" id="staff-no" className="h-5 w-5" />
              <Label htmlFor="staff-no" className="text-base md:text-sm text-foreground cursor-pointer md:font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
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
        onSaveResume={onSaveResume}
        canContinue={canContinue}
        showBack={showBack}
      />
    </div>
  );
};
import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface BinaryChoiceProps {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  yesLabel?: string;
  noLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const BinaryChoice = React.forwardRef<
  HTMLDivElement,
  BinaryChoiceProps
>(({ 
  value, 
  onValueChange, 
  label, 
  description,
  tooltip, 
  required = false,
  yesLabel = "Yes",
  noLabel = "No",
  className,
  disabled = false,
  ...props 
}, ref) => {
  const isMobile = useIsMobile();
  const id = React.useId();

  if (isMobile) {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-foreground">
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        <RadioGroup
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14">
            <RadioGroupItem value="yes" id={`${id}-yes`} className="h-5 w-5" />
            <Label htmlFor={`${id}-yes`} className="text-base text-foreground cursor-pointer flex-1">
              {yesLabel}
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg h-14">
            <RadioGroupItem value="no" id={`${id}-no`} className="h-5 w-5" />
            <Label htmlFor={`${id}-no`} className="text-base text-foreground cursor-pointer flex-1">
              {noLabel}
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${id}-yes`} className="h-5 w-5" />
          <Label htmlFor={`${id}-yes`} className="text-sm text-foreground cursor-pointer">
            {yesLabel}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${id}-no`} className="h-5 w-5" />
          <Label htmlFor={`${id}-no`} className="text-sm text-foreground cursor-pointer">
            {noLabel}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
});

BinaryChoice.displayName = "BinaryChoice";
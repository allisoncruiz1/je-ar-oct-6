import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileSelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MobileSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
}: MobileSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (option: string) => {
    onValueChange(option);
    setOpen(false);
  };

  const displayValue = value || placeholder;

  const TriggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "w-full justify-between h-12 text-base md:text-sm text-foreground",
        !value && "text-muted-foreground",
        className
      )}
    >
      <span className="truncate">{displayValue}</span>
      <svg
        className="ml-2 h-4 w-4 shrink-0 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </Button>
  );

  const OptionsList = (
    <div className="flex flex-col gap-1 p-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={cn(
            "flex items-center justify-between w-full rounded-md px-4 py-3 text-left transition-colors",
            "hover:bg-muted/50 active:bg-muted",
            "text-base md:text-sm",
            value === option && "bg-muted font-medium"
          )}
        >
          <span>{option}</span>
          {value === option && <Check className="h-5 w-5 text-primary" />}
        </button>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent className="max-h-[60vh]">
          <div className="overflow-y-auto">{OptionsList}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: use a simple dropdown
  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{TriggerButton}</div>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {OptionsList}
          </div>
        </>
      )}
    </div>
  );
}

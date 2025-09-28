import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, X, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileMultiSelectProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  className?: string;
}

export const MobileMultiSelect: React.FC<MobileMultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  searchPlaceholder,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    const isSelected = selectedValues.includes(option);
    const newValues = isSelected
      ? selectedValues.filter(value => value !== option)
      : [...selectedValues, option];
    onSelectionChange(newValues);
  };

  const handleRemoveOption = (option: string) => {
    const newValues = selectedValues.filter(value => value !== option);
    onSelectionChange(newValues);
  };

  const displayText = selectedValues.length === 0 
    ? placeholder 
    : `${selectedValues.length} item(s) selected`;

  const TriggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "w-full h-12 md:h-10 justify-between text-left font-normal text-base md:text-sm",
        "bg-gradient-to-r from-background to-muted/30 border-border/60",
        "hover:from-muted/50 hover:to-muted/80 hover:border-border",
        "focus:ring-2 focus:ring-ring/20 focus:border-ring/50",
        "shadow-sm hover:shadow-md transition-all duration-200 ease-out",
        "backdrop-blur-sm supports-[backdrop-filter]:bg-background/95",
        selectedValues.length === 0 ? "text-muted-foreground" : "text-foreground font-medium",
        className
      )}
    >
      <span className="tracking-wide">{displayText}</span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60 transition-transform duration-200 group-hover:opacity-80" />
    </Button>
  );

  const SelectionContent = (
    <div className="flex flex-col h-full max-h-[80vh] backdrop-blur-sm">
      {/* Search */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 md:h-10 text-base md:text-sm bg-background/80 border-border/60 focus:border-primary/50 shadow-inner"
          />
        </div>
      </div>

      {/* Selected Items */}
      {selectedValues.length > 0 && (
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-muted/20 to-muted/40">
          <div className="text-sm font-semibold text-foreground mb-3 tracking-wide">
            Selected ({selectedValues.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map(value => (
              <Badge 
                key={value} 
                variant="secondary" 
                className="text-sm px-4 py-2 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="font-medium">{value}</span>
                <X 
                  className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors p-0.5 hover:bg-destructive/10 rounded-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(value);
                  }}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="flex-1 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="space-y-2">
              <div className="text-base font-medium">No options found</div>
              <div className="text-sm">Try adjusting your search terms</div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-1">
            {filteredOptions.map((option, index) => (
              <div 
                key={option}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/80 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-ring/20 focus:bg-accent",
                  selectedValues.includes(option) && "bg-primary/5 border border-primary/20",
                  index === 0 && "mt-2"
                )}
                onClick={() => handleToggleOption(option)}
                tabIndex={0}
                role="option"
                aria-selected={selectedValues.includes(option)}
              >
                <Checkbox 
                  checked={selectedValues.includes(option)}
                  className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105"
                />
                <span className={cn(
                  "text-base md:text-sm flex-1 transition-colors",
                  selectedValues.includes(option) ? "font-medium text-primary" : "text-foreground"
                )}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] bg-gradient-to-b from-background via-background to-muted/10 border-t-2 border-border/30 shadow-2xl">
          <DrawerHeader className="text-left border-b border-border/30 bg-gradient-to-r from-background to-muted/20 px-6 py-4">
            <DrawerTitle className="text-lg font-semibold tracking-wide text-foreground">{placeholder}</DrawerTitle>
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-2" />
          </DrawerHeader>
          {SelectionContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {TriggerButton}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md bg-gradient-to-b from-background via-background to-muted/10 border-l-2 border-border/30 shadow-2xl backdrop-blur-sm">
        <SheetHeader className="border-b border-border/30 bg-gradient-to-r from-background to-muted/20 -mx-6 px-6 pb-4">
          <SheetTitle className="text-lg font-semibold tracking-wide text-foreground">{placeholder}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {SelectionContent}
        </div>
      </SheetContent>
    </Sheet>
  );
};
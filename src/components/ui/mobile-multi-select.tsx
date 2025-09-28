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
        "bg-card border-border hover:bg-accent/50",
        "focus:ring-2 focus:ring-ring/20 focus-visible:outline-none",
        "shadow-sm transition-colors",
        selectedValues.length === 0 ? "text-muted-foreground" : "text-foreground font-medium",
        className
      )}
    >
      <span className="tracking-wide">{displayText}</span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
    </Button>
  );

  const SelectionContent = (
    <div className="flex flex-col h-full max-h-[80vh] bg-card">
      {/* Search */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 md:h-10 text-base md:text-sm"
          />
        </div>
      </div>

      {/* Selected Items */}
      {selectedValues.length > 0 && (
        <div className="p-4 border-b bg-muted/30">
          <div className="text-sm font-medium text-foreground mb-2">
            Selected ({selectedValues.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map(value => (
              <Badge 
                key={value} 
                variant="secondary" 
                className="text-sm px-3 py-1 flex items-center gap-2"
              >
                {value}
                <X 
                  className="h-3.5 w-3.5 cursor-pointer hover:text-destructive" 
                  onClick={(e) => { e.stopPropagation(); handleRemoveOption(value); }}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="flex-1 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <div className="space-y-1">
              <div className="text-base font-medium">No options found</div>
              <div className="text-sm">Try adjusting your search terms</div>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredOptions.map((option) => (
              <div 
                key={option}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                  "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/20",
                )}
                onClick={() => handleToggleOption(option)}
                tabIndex={0}
                role="option"
                aria-selected={selectedValues.includes(option)}
              >
                <Checkbox 
                  checked={selectedValues.includes(option)}
                  className="h-4 w-4 shrink-0"
                />
                <span className={cn(
                  "text-base md:text-sm flex-1",
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
        <DrawerContent className="max-h-[85vh] bg-card border-t border-border shadow-xl z-50">
          <DrawerHeader className="text-left border-b border-border bg-card px-6 py-4">
            <DrawerTitle className="text-lg font-semibold tracking-wide text-foreground">{placeholder}</DrawerTitle>
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
      <SheetContent side="right" className="w-full sm:max-w-md bg-card border-l border-border shadow-xl z-50">
        <SheetHeader className="border-b border-border -mx-6 px-6 pb-4 bg-card">
          <SheetTitle className="text-lg font-semibold tracking-wide text-foreground">{placeholder}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {SelectionContent}
        </div>
      </SheetContent>
    </Sheet>
  );
};
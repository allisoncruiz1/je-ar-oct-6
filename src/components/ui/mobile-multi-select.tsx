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
        selectedValues.length === 0 ? "text-muted-foreground" : "text-foreground",
        className
      )}
    >
      {displayText}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const SelectionContent = (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Search */}
      <div className="p-4 border-b">
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
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveOption(value)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="flex-1 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No options found
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredOptions.map(option => (
              <div 
                key={option}
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleToggleOption(option)}
              >
                <Checkbox 
                  checked={selectedValues.includes(option)}
                  className="shrink-0"
                />
                <span className="text-base md:text-sm flex-1">{option}</span>
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
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{placeholder}</DrawerTitle>
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
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{placeholder}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {SelectionContent}
        </div>
      </SheetContent>
    </Sheet>
  );
};
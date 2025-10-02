import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddressConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void; // Use current address
  onEdit: () => void;    // Re-enter address
  onUseSuggested?: () => void; // Use suggested address if available
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  suggestedAddress?: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isVerified?: boolean;
}

export const AddressConfirmationDialog: React.FC<AddressConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onEdit,
  onUseSuggested,
  address,
  suggestedAddress,
  isVerified = false
}) => {
  const isMobile = useIsMobile();

  const content = (
    <>
      <Alert className="border-l-4 border-l-destructive bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-sm text-foreground">
          {typeof onUseSuggested === 'function' 
            ? 'We found a standardized address suggestion below.' 
            : 'We couldn\'t verify this address. Please review carefully before continuing.'}
        </AlertDescription>
      </Alert>

      {typeof onUseSuggested === 'function' && (
        <div className="mt-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-3 animate-in fade-in-50 duration-300">
          <div className="flex items-start gap-2.5 mb-2">
            <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
              <MapPin className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-primary mb-1.5">
                Suggested Address
              </div>
              <div className="space-y-0.5 text-sm">
                <div className="font-semibold text-foreground">{suggestedAddress?.addressLine1}</div>
                {suggestedAddress?.addressLine2 && <div className="text-foreground/80">{suggestedAddress?.addressLine2}</div>}
                <div className="text-foreground/80">{suggestedAddress?.city}, {suggestedAddress?.state} {suggestedAddress?.zipCode}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Your Entered Address
        </div>
        <div className="space-y-0.5 text-sm">
          <div className="font-medium text-foreground">
            {address.addressLine1}
          </div>
          {address.addressLine2 && (
            <div className="text-foreground/70">{address.addressLine2}</div>
          )}
          <div className="text-foreground/70">
            {address.city}, {address.state} {address.zipCode}
          </div>
        </div>
      </div>
    </>
  );

  const buttons = (
    <div className="flex flex-col gap-2 w-full">
      {typeof onUseSuggested === 'function' && (
        <Button 
          onClick={onUseSuggested} 
          className="w-full shadow-sm" 
          size="lg"
        >
          Use Suggested Address
        </Button>
      )}
      <Button
        variant="outline"
        onClick={onConfirm}
        className="w-full"
        size="lg"
      >
        Use My Address
      </Button>
      <Button
        variant="ghost"
        onClick={onEdit}
        className="w-full text-muted-foreground hover:text-foreground"
        size="lg"
      >
        Re-enter Address
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <div className="overflow-y-auto px-4">
            <DrawerHeader className="px-0 pb-3">
              <DrawerTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                Address Validation
              </DrawerTitle>
              <DrawerDescription className="text-left text-muted-foreground text-sm">
                Please confirm your manually entered address.
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="pb-3">
              {content}
            </div>
          </div>

          <DrawerFooter className="pt-3 px-4 pb-6 border-t border-border bg-background">
            {buttons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            Address Validation
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please confirm your manually entered address.
          </DialogDescription>
        </DialogHeader>
        
        {content}

        <DialogFooter className="flex-col gap-2 sm:gap-2 mt-4 pt-4 border-t border-border">
          {buttons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

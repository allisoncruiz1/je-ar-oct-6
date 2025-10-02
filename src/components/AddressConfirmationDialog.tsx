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
      <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          We couldn't verify this address. {typeof onUseSuggested === 'function' ? 'We found a standardized suggestion below.' : 'Please review carefully before continuing.'}
        </AlertDescription>
      </Alert>

      {typeof onUseSuggested === 'function' && (
        <div className="mt-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Suggested Address
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-semibold text-foreground">{suggestedAddress?.addressLine1}</div>
            {suggestedAddress?.addressLine2 && <div className="text-foreground">{suggestedAddress?.addressLine2}</div>}
            <div className="text-foreground">{suggestedAddress?.city}, {suggestedAddress?.state} {suggestedAddress?.zipCode}</div>
          </div>
        </div>
      )}
      
      <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="text-sm font-semibold text-muted-foreground mb-3">Your Address:</div>
        <div className="space-y-1.5 text-sm">
          <div className="text-foreground">
            <span className="font-medium">{address.addressLine1}</span>
          </div>
          {address.addressLine2 && (
            <div className="text-foreground">{address.addressLine2}</div>
          )}
          <div className="text-foreground">
            {address.city}, {address.state} {address.zipCode}
          </div>
        </div>
      </div>
    </>
  );

  const buttons = (
    <div className="flex flex-col gap-2 w-full">
      {typeof onUseSuggested === 'function' && (
        <Button onClick={onUseSuggested} className="w-full" size="lg">
          Use Suggested Address
        </Button>
      )}
      <Button
        variant="outline"
        onClick={onConfirm}
        className="w-full"
        size="lg"
      >
        Use Current Address
      </Button>
      <Button
        variant="ghost"
        onClick={onEdit}
        className="w-full"
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
            <DrawerHeader className="px-0">
              <DrawerTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Address Validation
              </DrawerTitle>
              <DrawerDescription className="text-left">
                Please confirm your manually entered address.
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="pb-4">
              {content}
            </div>
          </div>

          <DrawerFooter className="pt-2 px-4 pb-6">
            {buttons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Validation
          </DialogTitle>
          <DialogDescription>
            Please confirm your manually entered address.
          </DialogDescription>
        </DialogHeader>
        
        {content}

        <DialogFooter className="flex-col gap-2 sm:gap-2 mt-4">
          {buttons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

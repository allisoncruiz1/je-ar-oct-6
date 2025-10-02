import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Validation
          </DialogTitle>
          <DialogDescription>
            Please confirm your manually entered address.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="my-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            We couldn't verify this address. {typeof onUseSuggested === 'function' ? 'We found a standardized suggestion below.' : 'Please review carefully before continuing.'}
          </AlertDescription>
        </Alert>

        {typeof onUseSuggested === 'function' && (
          <div className="my-4 rounded-lg border border-border bg-background p-4">
            <div className="text-sm font-semibold text-primary mb-2">Suggested Address:</div>
            <div className="space-y-1 text-sm text-foreground">
              <div className="font-medium">{suggestedAddress?.addressLine1}</div>
              {suggestedAddress?.addressLine2 && <div>{suggestedAddress?.addressLine2}</div>}
              <div>{suggestedAddress?.city}, {suggestedAddress?.state} {suggestedAddress?.zipCode}</div>
            </div>
          </div>
        )}
        
        <div className="my-4 rounded-lg border border-border bg-muted/50 p-4">
          <div className="text-sm font-semibold text-muted-foreground mb-2">Current Address:</div>
          <div className="space-y-2">
            <div className="font-medium text-foreground">
              <span className="text-xs text-muted-foreground mr-2">Address:</span>
              {address.addressLine1}
            </div>
            {address.addressLine2 && (
              <div className="text-sm text-foreground">
                <span className="text-xs text-muted-foreground mr-2">Address 2:</span>
                {address.addressLine2}
              </div>
            )}
            <div className="text-sm text-foreground">
              <span className="text-xs text-muted-foreground mr-2">City:</span>
              {address.city}
            </div>
            <div className="text-sm text-foreground">
              <span className="text-xs text-muted-foreground mr-2">State:</span>
              {address.state}
            </div>
            <div className="text-sm text-foreground">
              <span className="text-xs text-muted-foreground mr-2">Zip code:</span>
              {address.zipCode}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {typeof onUseSuggested === 'function' && (
            <Button onClick={onUseSuggested} className="w-full sm:w-auto">
              Use Suggested Address
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Use Current Address
          </Button>
          <Button
            variant="ghost"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            Re-enter Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

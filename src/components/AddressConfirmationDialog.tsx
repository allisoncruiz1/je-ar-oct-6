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
import { CheckCircle2, MapPin } from 'lucide-react';

interface AddressConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onEdit: () => void;
  address: {
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
  address,
  isVerified = false
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Confirm Your Address
          </DialogTitle>
          <DialogDescription>
            Please review your mailing address carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 rounded-lg border border-border bg-muted/50 p-4">
          <div className="space-y-2">
            <div className="font-medium text-foreground">
              {address.addressLine1}
            </div>
            {address.addressLine2 && (
              <div className="text-sm text-muted-foreground">
                {address.addressLine2}
              </div>
            )}
            <div className="text-sm text-foreground">
              {address.city}, {address.state} {address.zipCode}
            </div>
          </div>
          
          {isVerified && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Address verified via autocomplete</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            Edit Address
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Confirm & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

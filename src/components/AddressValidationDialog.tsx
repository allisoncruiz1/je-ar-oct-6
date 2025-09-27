import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ValidationResult {
  suggested: AddressData;
  original: AddressData;
}

interface AddressValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: ValidationResult | null;
  onUseSuggested: () => void;
  onReenterAddress: () => void;
  onUseOriginal: () => void;
}

export const AddressValidationDialog: React.FC<AddressValidationDialogProps> = ({
  isOpen,
  onClose,
  validationResult,
  onUseSuggested,
  onReenterAddress,
  onUseOriginal,
}) => {
  if (!validationResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-md:max-w-[95vw] max-md:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Address Validation</DialogTitle>
        </DialogHeader>

        {/* Warning Banner */}
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">
              We found a suggested address change
            </h3>
            <p className="text-sm text-orange-800">
              Please review the suggested address below and select the correct option.
            </p>
          </div>
        </div>

        {/* Address Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Suggested Address */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-700 border-b border-green-200 pb-2">
              Suggested Address
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Address:</span>
                <div className="text-gray-700">
                  {validationResult.suggested.addressLine1}
                </div>
                {validationResult.suggested.addressLine2 && (
                  <div className="text-gray-700">
                    {validationResult.suggested.addressLine2}
                  </div>
                )}
              </div>
              <div>
                <span className="font-medium">City:</span>
                <span className="text-gray-700 ml-2">
                  {validationResult.suggested.city}
                </span>
              </div>
              <div>
                <span className="font-medium">State:</span>
                <span className="text-gray-700 ml-2">
                  {validationResult.suggested.state}
                </span>
              </div>
              <div>
                <span className="font-medium">ZIP Code:</span>
                <span className="text-gray-700 ml-2">
                  {validationResult.suggested.zipCode}
                </span>
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Current Address
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Address:</span>
                <div className="text-gray-700">
                  {validationResult.original.addressLine1}
                </div>
                {validationResult.original.addressLine2 && (
                  <div className="text-gray-700">
                    {validationResult.original.addressLine2}
                  </div>
                )}
              </div>
              <div>
                <span className="font-medium">City:</span>
                <span className="text-gray-700 ml-2">
                  {validationResult.original.city}
                </span>
              </div>
              <div>
                <span className="font-medium">State:</span>
                <span className="text-gray-700 ml-2">
                  {validationResult.original.state}
                </span>
              </div>
              <div>
                <span className="font-medium">ZIP Code:</span>
                <span className="text-gray-700 ml-2">
                  {validationResult.original.zipCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t">
          <Button
            onClick={onUseSuggested}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Use Suggested Address
          </Button>
          <Button
            onClick={onReenterAddress}
            variant="outline"
            className="flex-1"
          >
            Re-enter Address
          </Button>
          <Button
            onClick={onUseOriginal}
            variant="secondary"
            className="flex-1"
          >
            Use Current Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
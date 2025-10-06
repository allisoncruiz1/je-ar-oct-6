import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2 } from 'lucide-react';
import { MobileActionBar } from './MobileActionBar';
import { useIsMobile } from '@/hooks/use-mobile';

export interface DocumentSigningData {
  documents: {
    id: string;
    name: string;
    signed: boolean;
    signedAt?: Date;
  }[];
  allDocumentsSigned: boolean;
}

interface DocumentSigningFormProps {
  onContinue: () => void;
  onBack: () => void;
  onFormValidChange: (isValid: boolean) => void;
  onSaveResume?: () => void;
  initialData?: Partial<DocumentSigningData>;
  onFormDataChange?: (data: DocumentSigningData | null) => void;
  continueButtonText?: string;
  canContinue?: boolean;
  showBack?: boolean;
}

export const DocumentSigningForm: React.FC<DocumentSigningFormProps> = ({
  onContinue,
  onBack,
  onFormValidChange,
  onSaveResume,
  initialData,
  onFormDataChange,
  continueButtonText = 'Complete Application',
  canContinue = false,
  showBack = true,
}) => {
  const isMobile = useIsMobile();
  
  const [documents, setDocuments] = useState(
    initialData?.documents || [
      { id: '1', name: 'Independent Contractor Agreement', signed: false },
      { id: '2', name: 'W9 2024', signed: false },
    ]
  );

  const allSigned = documents.every((doc) => doc.signed);

  useEffect(() => {
    onFormValidChange(allSigned);
  }, [allSigned, onFormValidChange]);

  useEffect(() => {
    if (allSigned) {
      const data: DocumentSigningData = {
        documents,
        allDocumentsSigned: allSigned,
      };
      onFormDataChange?.(data);
    }
  }, [documents, allSigned, onFormDataChange]);

  const handleSign = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, signed: true, signedAt: new Date() }
          : doc
      )
    );
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Information Banner */}
      <div className="p-4 rounded-lg border-l-4 border-[hsl(var(--brand-blue))] bg-[hsl(var(--brand-blue))]/5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-[hsl(var(--brand-blue))]">Important:</span> You will receive an email from JoinApp and DDC to complete your document packet. Please review and sign all required documents.
        </p>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Required Documents</h3>
        
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-lg border-2 border-border bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                doc.signed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {doc.signed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-foreground">{doc.name}</div>
                {doc.signed && doc.signedAt && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Signed on {doc.signedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => handleSign(doc.id)}
              disabled={doc.signed}
              variant={doc.signed ? 'outline' : 'default'}
              size="sm"
              className="ml-3"
            >
              {doc.signed ? 'Signed' : 'Sign'}
            </Button>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {allSigned && (
        <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-green-800 font-medium">
            ✓ All documents have been signed. You can now complete your application.
          </p>
        </div>
      )}

      {/* Desktop Buttons */}
      {!isMobile && (
        <div className="flex gap-3 pt-4">
          {showBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onSaveResume}
            className="flex-1"
          >
            Save & Resume Later
          </Button>
          <Button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="flex-1"
          >
            {continueButtonText}
          </Button>
        </div>
      )}

      {/* Mobile Action Bar */}
      {isMobile && (
        <MobileActionBar
          onBack={showBack ? onBack : undefined}
          onContinue={onContinue}
          onSaveResume={onSaveResume}
          canContinue={canContinue}
          continueButtonText={continueButtonText}
        />
      )}
    </div>
  );
};

import React from 'react';
import { MapPin, FileText, Award, Building2, Users, UserCheck, CreditCard, Landmark, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileActionBar } from '@/components/MobileActionBar';

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface LicenseBusinessData {
  preferredName: string;
  isLicensed: string;
  licensedStates: string[];
  conductBusinessOutsideUS: string;
  internationalCountries: string[];
}

interface LicenseDetailsData {
  [state: string]: {
    licenseNumber?: string;
    salesTransactions?: string;
    mentorProgram?: string;
    pendingTransactions?: string;
    associations?: string[];
    mlsAffiliations?: string[];
  };
}

interface BusinessOverviewData {
  hasPreExistingMatters?: string;
  preExistingMatters?: string[];
  transferLicenseDate?: Date;
  hasPhysicalOffice?: string;
  formingDomesticPartnership?: string;
}

interface TeamFunctionData {
  teamType?: string;
  teamName?: string;
  teamLeadName?: string;
}

interface PaymentInfoData {
  paymentMethods: Array<{
    type: string;
    details: any;
  }>;
}

interface DirectDepositData {
  firstName: string;
  lastName: string;
  businessName: string;
  bankName: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

interface ReviewPageProps {
  addressData: AddressData | null;
  licenseBusinessData: LicenseBusinessData | null;
  licenseDetailsData: LicenseDetailsData;
  businessOverviewData: BusinessOverviewData | null;
  teamFunctionData: TeamFunctionData | null;
  paymentInfoData: PaymentInfoData | null;
  directDepositData: DirectDepositData | null;
  onEdit: (section: number) => void;
  onBack: () => void;
  onContinue: () => void;
  onSaveResume?: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  addressData,
  licenseBusinessData,
  licenseDetailsData,
  businessOverviewData,
  teamFunctionData,
  paymentInfoData,
  directDepositData,
  onEdit,
  onBack,
  onContinue,
  onSaveResume
}) => {
  const ReviewSection: React.FC<{
    icon: React.ReactNode;
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
  }> = ({ icon, title, onEdit, children }) => (
    <div className="bg-background border border-border rounded-lg p-6 max-md:p-4">
      <div className="flex items-start justify-between mb-6 max-md:mb-4">
        <div className="flex items-center gap-3">
          <div className="text-foreground">{icon}</div>
          <h3 className="text-lg font-semibold text-foreground max-md:text-base">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2 text-primary hover:text-primary"
          aria-label={`Edit ${title}`}
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>
      <div className="space-y-4 max-md:space-y-3">
        {children}
      </div>
    </div>
  );

  const DataField: React.FC<{ label: string; value: string | string[] | undefined }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-base text-foreground">
          {Array.isArray(value) ? value.join(', ') : value}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-md:space-y-4 pb-24 max-md:pb-4">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground max-md:text-2xl">
          Review Your Application
        </h1>
        <p className="text-base text-foreground leading-relaxed max-md:text-sm">
          Please review all your information below. You can edit any section by clicking the "Edit" button. Once you confirm everything is correct, proceed to the documents step.
        </p>
        
        {/* Info banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-md:p-3">
          <p className="text-sm text-primary leading-relaxed max-md:text-xs">
            You can update your payment details anytime after submitting your application in your My eXp account.
          </p>
        </div>
      </div>

      {/* Your Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground max-md:text-lg">Your Information</h2>

        {/* Mailing Address */}
        {addressData && (
          <ReviewSection
            icon={<MapPin className="h-5 w-5" />}
            title="Mailing Address"
            onEdit={() => onEdit(0)}
          >
            <DataField label="Address Line 1*" value={addressData.addressLine1} />
            {addressData.addressLine2 && (
              <DataField label="Address Line 2 (Optional)" value={addressData.addressLine2} />
            )}
            <DataField label="City*" value={addressData.city} />
            <DataField label="State*" value={addressData.state} />
            <DataField label="Zip code*" value={addressData.zipCode} />
          </ReviewSection>
        )}

        {/* License Business Info */}
        {licenseBusinessData && (
          <ReviewSection
            icon={<FileText className="h-5 w-5" />}
            title="License Business Information"
            onEdit={() => onEdit(1)}
          >
            <DataField label="Preferred Name" value={licenseBusinessData.preferredName} />
            <DataField label="Licensed in Real Estate" value={licenseBusinessData.isLicensed} />
            {licenseBusinessData.licensedStates.length > 0 && (
              <DataField label="Licensed States" value={licenseBusinessData.licensedStates} />
            )}
            <DataField 
              label="Conduct Business Outside US" 
              value={licenseBusinessData.conductBusinessOutsideUS} 
            />
            {licenseBusinessData.internationalCountries.length > 0 && (
              <DataField label="Countries" value={licenseBusinessData.internationalCountries} />
            )}
          </ReviewSection>
        )}

        {/* License Details */}
        {Object.keys(licenseDetailsData).length > 0 && (
          <ReviewSection
            icon={<Award className="h-5 w-5" />}
            title="License Details"
            onEdit={() => onEdit(2)}
          >
            {Object.entries(licenseDetailsData).map(([state, details]) => (
              <div key={state} className="space-y-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <p className="font-semibold text-foreground">{state}</p>
                <div className="space-y-3 pl-4">
                  <DataField label="License Number" value={details.licenseNumber} />
                  <DataField label="Sales Transactions" value={details.salesTransactions} />
                  {details.mentorProgram && (
                    <DataField label="Mentor Program" value={details.mentorProgram} />
                  )}
                  {details.pendingTransactions && (
                    <DataField label="Pending Transactions" value={details.pendingTransactions} />
                  )}
                  {details.associations && details.associations.length > 0 && (
                    <DataField label="Associations" value={details.associations} />
                  )}
                  {details.mlsAffiliations && details.mlsAffiliations.length > 0 && (
                    <DataField label="MLS Affiliations" value={details.mlsAffiliations} />
                  )}
                </div>
              </div>
            ))}
          </ReviewSection>
        )}

        {/* Business Overview */}
        {businessOverviewData && (
          <ReviewSection
            icon={<Building2 className="h-5 w-5" />}
            title="Business Overview"
            onEdit={() => onEdit(3)}
          >
            <DataField 
              label="Pre-existing Matters" 
              value={businessOverviewData.hasPreExistingMatters} 
            />
            {businessOverviewData.preExistingMatters && businessOverviewData.preExistingMatters.length > 0 && (
              <DataField label="Matter Types" value={businessOverviewData.preExistingMatters} />
            )}
            {businessOverviewData.transferLicenseDate && (
              <DataField 
                label="License Transfer Date" 
                value={businessOverviewData.transferLicenseDate.toLocaleDateString()} 
              />
            )}
            <DataField 
              label="Physical Office" 
              value={businessOverviewData.hasPhysicalOffice} 
            />
            {businessOverviewData.formingDomesticPartnership && (
              <DataField 
                label="Forming Domestic Partnership" 
                value={businessOverviewData.formingDomesticPartnership} 
              />
            )}
          </ReviewSection>
        )}

        {/* Team Function */}
        {teamFunctionData && (
          <ReviewSection
            icon={<Users className="h-5 w-5" />}
            title="Team Function"
            onEdit={() => onEdit(4)}
          >
            <DataField label="Team Type" value={teamFunctionData.teamType} />
            {teamFunctionData.teamName && (
              <DataField label="Team Name" value={teamFunctionData.teamName} />
            )}
            {teamFunctionData.teamLeadName && (
              <DataField label="Team Lead Name" value={teamFunctionData.teamLeadName} />
            )}
          </ReviewSection>
        )}
      </div>

      {/* Sponsor Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground max-md:text-lg">Sponsor</h2>
        <ReviewSection
          icon={<UserCheck className="h-5 w-5" />}
          title="Sponsor Information"
          onEdit={() => onEdit(5)}
        >
          <p className="text-sm text-muted-foreground">Sponsor details will be displayed here</p>
        </ReviewSection>
      </div>

      {/* Financial Info Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground max-md:text-lg">Financial Info</h2>

        {/* Payment Info */}
        {paymentInfoData && (
          <ReviewSection
            icon={<CreditCard className="h-5 w-5" />}
            title="Payment Information"
            onEdit={() => onEdit(6)}
          >
            {paymentInfoData.paymentMethods.map((method, index) => (
              <div key={index} className="space-y-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <p className="font-semibold text-foreground capitalize">
                  {method.type.replace('-', ' ')}
                </p>
                <div className="space-y-3 pl-4">
                  {method.type === 'credit-card' && (
                    <>
                      <DataField label="Card Number" value={`**** **** **** ${method.details.cardNumber?.slice(-4) || ''}`} />
                      <DataField label="Cardholder Name" value={method.details.cardholderName} />
                      <DataField label="Expiry Date" value={method.details.expiryDate} />
                    </>
                  )}
                  {method.type === 'bank-account' && (
                    <>
                      <DataField label="Account Number" value={`****${method.details.accountNumber?.slice(-4) || ''}`} />
                      <DataField label="Routing Number" value={method.details.routingNumber} />
                      <DataField label="Account Type" value={method.details.accountType} />
                    </>
                  )}
                </div>
              </div>
            ))}
          </ReviewSection>
        )}

        {/* Direct Deposit */}
        {directDepositData && (
          <ReviewSection
            icon={<Landmark className="h-5 w-5" />}
            title="Direct Deposit Information"
            onEdit={() => onEdit(7)}
          >
            <DataField label="First Name" value={directDepositData.firstName} />
            <DataField label="Last Name" value={directDepositData.lastName} />
            {directDepositData.businessName && (
              <DataField label="Business Name" value={directDepositData.businessName} />
            )}
            <DataField label="Bank Name" value={directDepositData.bankName} />
            <DataField label="Account Type" value={directDepositData.accountType} />
            <DataField label="Account Number" value={`****${directDepositData.accountNumber?.slice(-4) || ''}`} />
            <DataField label="Routing Number" value={directDepositData.routingNumber} />
          </ReviewSection>
        )}
      </div>

      {/* Desktop Action Bar */}
      <div className="hidden md:block sticky bottom-0 bg-background border-t border-border p-4 mt-6 -mx-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onSaveResume}
            aria-label="Save and resume application later"
          >
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              aria-label="Go back to previous step"
            >
              Back
            </Button>
            <Button
              onClick={onContinue}
              aria-label="Continue to documents step"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <MobileActionBar
        onBack={onBack}
        onContinue={onContinue}
        onSaveResume={onSaveResume}
        canContinue={true}
        showBack={true}
      />
    </div>
  );
};
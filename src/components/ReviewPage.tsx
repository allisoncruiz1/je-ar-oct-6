import React, { useState } from 'react';
import { MapPin, FileText, Award, Building2, Users, UserCheck, CreditCard, Landmark, Pencil, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileActionBar } from '@/components/MobileActionBar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

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
  const isMobile = useIsMobile();
  const [expandedSections, setExpandedSections] = useState<string[]>(['your-information']);

  const toggleAllSections = () => {
    if (expandedSections.length === 3) {
      setExpandedSections([]);
    } else {
      setExpandedSections(['your-information', 'sponsor', 'financial-info']);
    }
  };

  // Count items in each section
  const yourInfoCount = [addressData, licenseBusinessData, Object.keys(licenseDetailsData).length > 0, businessOverviewData, teamFunctionData].filter(Boolean).length;
  const sponsorCount = 1;
  const financialInfoCount = [paymentInfoData, directDepositData].filter(Boolean).length;
  const ReviewSection: React.FC<{
    icon: React.ReactNode;
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
  }> = ({ icon, title, onEdit, children }) => (
    <div className="bg-card border-2 border-border rounded-2xl p-6 max-md:p-4 transition-all hover:border-[hsl(var(--brand-blue))]/30 hover:shadow-sm group">
      <div className="flex items-center justify-between mb-6 max-md:mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center text-[hsl(var(--brand-blue))]">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground max-md:text-base">{title}</h3>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-[hsl(var(--brand-blue))] transition-colors px-3 py-1.5 rounded-md hover:bg-[hsl(var(--brand-blue))]/5 border border-transparent hover:border-[hsl(var(--brand-blue))]/20"
          aria-label={`Edit ${title}`}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
      </div>
      <div className="space-y-5 max-md:space-y-4">
        {children}
      </div>
    </div>
  );

  const DataField: React.FC<{ label: string; value: string | string[] | undefined }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    return (
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-base font-medium text-foreground leading-relaxed">
          {Array.isArray(value) ? value.join(', ') : value}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-md:space-y-6 pb-24 max-md:pb-4">
      {/* Header */}
      <div className="space-y-6 max-md:space-y-4 mb-2">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground max-md:text-2xl">
            Review Your Application
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-md:text-sm">
            Please review all your information below. You can edit any section by clicking the "Edit" button. Once you confirm everything is correct, proceed to the documents step.
          </p>
        </div>
        
        {/* Info banner */}
        <div className="p-4 rounded-lg border-l-4 border-[hsl(var(--brand-blue))] bg-[hsl(var(--brand-blue))]/5 max-md:p-3">
          <p className="text-sm text-muted-foreground leading-relaxed max-md:text-xs">
            <span className="font-semibold text-[hsl(var(--brand-blue))]">Note:</span> You can update your payment details anytime after submitting your application in your My eXp account.
          </p>
        </div>
      </div>

      {/* Compact Summary Section */}
      <div className="bg-gradient-to-r from-[hsl(var(--brand-blue))]/5 to-[hsl(var(--brand-blue))]/10 border-2 border-[hsl(var(--brand-blue))]/20 rounded-2xl p-6 max-md:p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3 flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--brand-blue))]" />
              <h2 className="text-lg font-semibold text-foreground">Application Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {addressData && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                  <p className="font-medium text-foreground">{addressData.city}, {addressData.state}</p>
                </div>
              )}
              {licenseBusinessData && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Licensed States</p>
                  <p className="font-medium text-foreground">{licenseBusinessData.licensedStates.length || 0}</p>
                </div>
              )}
              {paymentInfoData && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Payment Method</p>
                  <p className="font-medium text-foreground capitalize">
                    {paymentInfoData.paymentMethods[0]?.type.replace('-', ' ') || 'Not set'}
                  </p>
                </div>
              )}
            </div>
          </div>
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllSections}
              className="flex items-center gap-2"
            >
              {expandedSections.length === 3 ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Your Information Section */}
      {isMobile ? (
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          <AccordionItem value="your-information" className="border-2 rounded-2xl px-4 bg-muted/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
                <h2 className="text-lg font-semibold text-foreground">Your Information</h2>
                <Badge variant="secondary" className="ml-auto mr-2">{yourInfoCount}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
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

              {Object.keys(licenseDetailsData).length > 0 && (
                <ReviewSection
                  icon={<Award className="h-5 w-5" />}
                  title="License Details"
                  onEdit={() => onEdit(2)}
                >
                  {Object.entries(licenseDetailsData).map(([state, details]) => (
                    <div key={state} className="space-y-4 pb-5 border-b border-border last:border-0 last:pb-0">
                      <p className="font-semibold text-foreground text-base">{state}</p>
                      <div className="space-y-4 pl-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="space-y-5 bg-muted/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
            <h2 className="text-xl font-semibold text-foreground">Your Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>

          {Object.keys(licenseDetailsData).length > 0 && (
            <ReviewSection
              icon={<Award className="h-5 w-5" />}
              title="License Details"
              onEdit={() => onEdit(2)}
            >
              {Object.entries(licenseDetailsData).map(([state, details]) => (
                <div key={state} className="space-y-4 pb-5 border-b border-border last:border-0 last:pb-0">
                  <p className="font-semibold text-foreground text-base">{state}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        </div>
      )}

      {/* Sponsor Section */}
      {isMobile ? (
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          <AccordionItem value="sponsor" className="border-2 rounded-2xl px-4 bg-muted/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
                <h2 className="text-lg font-semibold text-foreground">Sponsor</h2>
                <Badge variant="secondary" className="ml-auto mr-2">{sponsorCount}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              <ReviewSection
                icon={<UserCheck className="h-5 w-5" />}
                title="Sponsor Information"
                onEdit={() => onEdit(5)}
              >
                <p className="text-sm text-muted-foreground">Sponsor details will be displayed here</p>
              </ReviewSection>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="space-y-5 bg-muted/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
            <h2 className="text-xl font-semibold text-foreground">Sponsor</h2>
          </div>
          <ReviewSection
            icon={<UserCheck className="h-5 w-5" />}
            title="Sponsor Information"
            onEdit={() => onEdit(5)}
          >
            <p className="text-sm text-muted-foreground">Sponsor details will be displayed here</p>
          </ReviewSection>
        </div>
      )}

      {/* Financial Info Section */}
      {isMobile ? (
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          <AccordionItem value="financial-info" className="border-2 rounded-2xl px-4 bg-muted/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
                <h2 className="text-lg font-semibold text-foreground">Financial Info</h2>
                <Badge variant="secondary" className="ml-auto mr-2">{financialInfoCount}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              {paymentInfoData && (
                <ReviewSection
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Payment Information"
                  onEdit={() => onEdit(6)}
                >
                  {paymentInfoData.paymentMethods.map((method, index) => (
                    <div key={index} className="space-y-4 pb-5 border-b border-border last:border-0 last:pb-0">
                      <p className="font-semibold text-foreground capitalize text-base">
                        {method.type.replace('-', ' ')}
                      </p>
                      <div className="space-y-4 pl-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="space-y-5 bg-muted/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
            <h2 className="text-xl font-semibold text-foreground">Financial Info</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paymentInfoData && (
              <ReviewSection
                icon={<CreditCard className="h-5 w-5" />}
                title="Payment Information"
                onEdit={() => onEdit(6)}
              >
                {paymentInfoData.paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-4 pb-5 border-b border-border last:border-0 last:pb-0">
                    <p className="font-semibold text-foreground capitalize text-base">
                      {method.type.replace('-', ' ')}
                    </p>
                    <div className="space-y-4 pl-4">
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
        </div>
      )}

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
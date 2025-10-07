import React, { useState } from 'react';
import { MapPin, FileText, Award, Building2, Users, UserCheck, CreditCard, Landmark, CheckCircle2, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
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
  plannedLicenseStates: string[];
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
    certifiedMentor?: string;
    selectedMentor?: string;
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
    onEdit?: () => void;
    children: React.ReactNode;
  }> = ({
    icon,
    title,
    onEdit,
    children
  }) => <div className="bg-card border-2 border-border rounded-2xl p-6 max-md:p-4 transition-all hover:border-[hsl(var(--brand-blue))]/30 hover:shadow-sm group relative">
      <div className="flex items-center justify-between mb-6 max-md:mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center text-[hsl(var(--brand-blue))]">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground max-md:text-base">{title}</h3>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Edit ${title}`}
          >
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-5 max-md:space-y-4">
        {children}
      </div>
    </div>;
  const DataField: React.FC<{
    label: string;
    value: string | string[] | undefined;
  }> = ({
    label,
    value
  }) => {
    if (!value || Array.isArray(value) && value.length === 0) return null;
    return <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-base font-medium text-foreground leading-relaxed">
          {Array.isArray(value) ? value.join(', ') : value}
        </p>
      </div>;
  };
  return <div className="space-y-8 max-md:space-y-6 pb-24 max-md:pb-4">
      {/* Header */}
      <div className="space-y-6 max-md:space-y-4 mb-2 pt-6 max-md:pt-4">
        <div className="space-y-3">
          <h1 className="text-foreground text-xl font-semibold">
            Review Your Application
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-md:text-sm">
            Please review all your information below. You can edit any section by clicking the "Edit" button. Once you confirm everything is correct, proceed to the documents step.
          </p>
        </div>
      </div>


      {/* Your Information Section */}
      {isMobile ? <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          <AccordionItem value="your-information" className="border-2 rounded-2xl px-4 bg-muted/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
                <h2 className="text-lg font-semibold text-foreground">Your Information</h2>
                <Badge variant="secondary" className="ml-auto mr-2">{yourInfoCount}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              {addressData && <ReviewSection icon={<MapPin className="h-5 w-5" />} title="Mailing Address" onEdit={() => onEdit(0)}>
                  <DataField label="Address Line 1*" value={addressData.addressLine1} />
                  {addressData.addressLine2 && <DataField label="Address Line 2 (Optional)" value={addressData.addressLine2} />}
                  <DataField label="City*" value={addressData.city} />
                  <DataField label="State*" value={addressData.state} />
                  <DataField label="Zip code*" value={addressData.zipCode} />
                </ReviewSection>}

              {licenseBusinessData && <ReviewSection icon={<FileText className="h-5 w-5" />} title="License & Business Information" onEdit={() => onEdit(1)}>
                  <DataField label="Preferred Name" value={licenseBusinessData.preferredName} />
                  <DataField label="Licensed in Real Estate" value={licenseBusinessData.isLicensed} />
                  {licenseBusinessData.isLicensed === 'yes' && licenseBusinessData.licensedStates.length > 0 && <DataField label="Licensed States" value={licenseBusinessData.licensedStates} />}
                  {licenseBusinessData.isLicensed === 'no' && licenseBusinessData.plannedLicenseStates.length > 0 && <DataField label="Planned License States" value={licenseBusinessData.plannedLicenseStates} />}
                  <DataField label="Conduct Business Outside US" value={licenseBusinessData.conductBusinessOutsideUS} />
                  {licenseBusinessData.internationalCountries.length > 0 && <DataField label="Countries" value={licenseBusinessData.internationalCountries} />}
                </ReviewSection>}

              {Object.keys(licenseDetailsData).length > 0 && <ReviewSection icon={<Award className="h-5 w-5" />} title="License Details" onEdit={() => onEdit(2)}>
                  {Object.entries(licenseDetailsData).map(([state, details]) => <div key={state} className="space-y-4 pb-5 border-b border-border last:border-0 last:pb-0">
                      <p className="font-semibold text-foreground text-base">{state}</p>
                      <div className="space-y-4 pl-4">
                        <DataField label="License Number" value={details.licenseNumber} />
                        <DataField label="Sales Transactions" value={details.salesTransactions} />
                        {details.mentorProgram && <DataField label="Mentor Program" value={details.mentorProgram} />}
                        {details.pendingTransactions && <DataField label="Pending Transactions" value={details.pendingTransactions} />}
                        {details.associations && details.associations.length > 0 && <DataField label="Associations" value={details.associations} />}
                        {details.mlsAffiliations && details.mlsAffiliations.length > 0 && <DataField label="MLS Affiliations" value={details.mlsAffiliations} />}
                        {details.certifiedMentor && <DataField label="Certified Mentor" value={details.certifiedMentor} />}
                        {details.selectedMentor && <DataField label="Selected Mentor" value={details.selectedMentor} />}
                      </div>
                    </div>)}
                </ReviewSection>}

              {businessOverviewData && <ReviewSection icon={<Building2 className="h-5 w-5" />} title="Business Overview" onEdit={() => onEdit(3)}>
                  <DataField label="Pre-existing Matters" value={businessOverviewData.hasPreExistingMatters} />
                  {businessOverviewData.preExistingMatters && businessOverviewData.preExistingMatters.length > 0 && <DataField label="Matter Types" value={businessOverviewData.preExistingMatters} />}
                  {businessOverviewData.transferLicenseDate && <DataField label="License Transfer Date" value={businessOverviewData.transferLicenseDate.toLocaleDateString()} />}
                  <DataField label="Physical Office" value={businessOverviewData.hasPhysicalOffice} />
                  {businessOverviewData.formingDomesticPartnership && <DataField label="Forming Domestic Partnership" value={businessOverviewData.formingDomesticPartnership} />}
                </ReviewSection>}

              {teamFunctionData && <ReviewSection icon={<Users className="h-5 w-5" />} title="Team Function" onEdit={() => onEdit(4)}>
                  <DataField label="Team Type" value={teamFunctionData.teamType} />
                  {teamFunctionData.teamName && <DataField label="Team Name" value={teamFunctionData.teamName} />}
                  {teamFunctionData.teamLeadName && <DataField label="Team Lead Name" value={teamFunctionData.teamLeadName} />}
                </ReviewSection>}
            </AccordionContent>
          </AccordionItem>
        </Accordion> : <div className="space-y-5 bg-muted/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
            <h2 className="text-xl font-semibold text-foreground">Your Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addressData && <ReviewSection icon={<MapPin className="h-5 w-5" />} title="Mailing Address" onEdit={() => onEdit(0)}>
                <DataField label="Address Line 1*" value={addressData.addressLine1} />
                {addressData.addressLine2 && <DataField label="Address Line 2 (Optional)" value={addressData.addressLine2} />}
                <DataField label="City*" value={addressData.city} />
                <DataField label="State*" value={addressData.state} />
                <DataField label="Zip code*" value={addressData.zipCode} />
              </ReviewSection>}

            {licenseBusinessData && <ReviewSection icon={<FileText className="h-5 w-5" />} title="License & Business Information" onEdit={() => onEdit(1)}>
                <DataField label="Preferred Name" value={licenseBusinessData.preferredName} />
                <DataField label="Licensed in Real Estate" value={licenseBusinessData.isLicensed} />
                {licenseBusinessData.isLicensed === 'yes' && licenseBusinessData.licensedStates.length > 0 && <DataField label="Licensed States" value={licenseBusinessData.licensedStates} />}
                {licenseBusinessData.isLicensed === 'no' && licenseBusinessData.plannedLicenseStates.length > 0 && <DataField label="Planned License States" value={licenseBusinessData.plannedLicenseStates} />}
                <DataField label="Conduct Business Outside US" value={licenseBusinessData.conductBusinessOutsideUS} />
                {licenseBusinessData.internationalCountries.length > 0 && <DataField label="Countries" value={licenseBusinessData.internationalCountries} />}
              </ReviewSection>}
          </div>

          {Object.keys(licenseDetailsData).length > 0 && <ReviewSection icon={<Award className="h-5 w-5" />} title="License Details" onEdit={() => onEdit(2)}>
              {Object.entries(licenseDetailsData).map(([state, details]) => <div key={state} className="space-y-4 pb-5 border-b border-border last:border-0 last:pb-0">
                  <p className="font-semibold text-foreground text-base">{state}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4">
                    <DataField label="License Number" value={details.licenseNumber} />
                    <DataField label="Sales Transactions" value={details.salesTransactions} />
                    {details.mentorProgram && <DataField label="Mentor Program" value={details.mentorProgram} />}
                    {details.pendingTransactions && <DataField label="Pending Transactions" value={details.pendingTransactions} />}
                    {details.associations && details.associations.length > 0 && <DataField label="Associations" value={details.associations} />}
                    {details.mlsAffiliations && details.mlsAffiliations.length > 0 && <DataField label="MLS Affiliations" value={details.mlsAffiliations} />}
                    {details.certifiedMentor && <DataField label="Certified Mentor" value={details.certifiedMentor} />}
                    {details.selectedMentor && <DataField label="Selected Mentor" value={details.selectedMentor} />}
                  </div>
                </div>)}
            </ReviewSection>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {businessOverviewData && <ReviewSection icon={<Building2 className="h-5 w-5" />} title="Business Overview" onEdit={() => onEdit(3)}>
                <DataField label="Pre-existing Matters" value={businessOverviewData.hasPreExistingMatters} />
                {businessOverviewData.preExistingMatters && businessOverviewData.preExistingMatters.length > 0 && <DataField label="Matter Types" value={businessOverviewData.preExistingMatters} />}
                {businessOverviewData.transferLicenseDate && <DataField label="License Transfer Date" value={businessOverviewData.transferLicenseDate.toLocaleDateString()} />}
                <DataField label="Physical Office" value={businessOverviewData.hasPhysicalOffice} />
                {businessOverviewData.formingDomesticPartnership && <DataField label="Forming Domestic Partnership" value={businessOverviewData.formingDomesticPartnership} />}
              </ReviewSection>}

            {teamFunctionData && <ReviewSection icon={<Users className="h-5 w-5" />} title="Team Function" onEdit={() => onEdit(4)}>
                <DataField label="Team Type" value={teamFunctionData.teamType} />
                {teamFunctionData.teamName && <DataField label="Team Name" value={teamFunctionData.teamName} />}
                {teamFunctionData.teamLeadName && <DataField label="Team Lead Name" value={teamFunctionData.teamLeadName} />}
              </ReviewSection>}
          </div>
        </div>}

      {/* Sponsor Section */}
      {isMobile ? <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          <AccordionItem value="sponsor" className="border-2 rounded-2xl px-4 bg-muted/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
                <h2 className="text-lg font-semibold text-foreground">Sponsor</h2>
                <Badge variant="secondary" className="ml-auto mr-2">{sponsorCount}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              <ReviewSection icon={<UserCheck className="h-5 w-5" />} title="Sponsor Information" onEdit={() => onEdit(5)}>
                <p className="text-sm text-muted-foreground">Sponsor details will be displayed here</p>
              </ReviewSection>
            </AccordionContent>
          </AccordionItem>
        </Accordion> : <div className="space-y-5 bg-muted/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
            <h2 className="text-xl font-semibold text-foreground">Sponsor</h2>
          </div>
          <ReviewSection icon={<UserCheck className="h-5 w-5" />} title="Sponsor Information" onEdit={() => onEdit(5)}>
            <p className="text-sm text-muted-foreground">Sponsor details will be displayed here</p>
          </ReviewSection>
        </div>}

      {/* Financial Info Section */}
      {isMobile ? <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          <AccordionItem value="financial-info" className="border-2 rounded-2xl px-4 bg-muted/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
                <h2 className="text-lg font-semibold text-foreground">Financial Info</h2>
                <Badge variant="secondary" className="ml-auto mr-2">{financialInfoCount}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 pb-4">
              {/* Info banner */}
              <div className="p-4 rounded-lg border-l-4 border-[hsl(var(--brand-blue))] bg-[hsl(var(--brand-blue))]/5 max-md:p-3">
                <p className="text-sm text-muted-foreground leading-relaxed max-md:text-xs">
                  <span className="font-semibold text-[hsl(var(--brand-blue))]">Note:</span> You can update your payment details anytime after submitting your application in your My eXp account.
                </p>
              </div>

              {paymentInfoData && <ReviewSection icon={<CreditCard className="h-5 w-5" />} title="Payment Information">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-base font-medium">Payment information has been confirmed.</p>
                  </div>
                </ReviewSection>}

              {directDepositData && <ReviewSection icon={<Landmark className="h-5 w-5" />} title="Direct Deposit Information">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-base font-medium">Direct Deposit Information is confirmed.</p>
                  </div>
                </ReviewSection>}
            </AccordionContent>
          </AccordionItem>
        </Accordion> : <div className="space-y-5 bg-muted/30 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-1 rounded-full bg-[hsl(var(--brand-blue))]" />
            <h2 className="text-xl font-semibold text-foreground">Financial Info</h2>
          </div>

          {/* Info banner */}
          <div className="p-4 rounded-lg border-l-4 border-[hsl(var(--brand-blue))] bg-[hsl(var(--brand-blue))]/5 max-md:p-3 mb-5">
            <p className="text-sm text-muted-foreground leading-relaxed max-md:text-xs">
              <span className="font-semibold text-[hsl(var(--brand-blue))]">Note:</span> You can update your payment details anytime after submitting your application in your My eXp account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paymentInfoData && <ReviewSection icon={<CreditCard className="h-5 w-5" />} title="Payment Information">
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-base font-medium">Payment information has been confirmed.</p>
                </div>
              </ReviewSection>}

            {directDepositData && <ReviewSection icon={<Landmark className="h-5 w-5" />} title="Direct Deposit Information">
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-base font-medium">Direct Deposit Information is confirmed.</p>
                </div>
              </ReviewSection>}
          </div>
        </div>}

      {/* Desktop Action Bar */}
      <div className="hidden md:block sticky bottom-0 bg-background border-t border-border p-4 mt-6 -mx-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onSaveResume} aria-label="Save and resume application later">
            Save & Resume Later
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onBack} aria-label="Go back to previous step">
              Back
            </Button>
            <Button onClick={onContinue} aria-label="Continue to documents step">
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <MobileActionBar onBack={onBack} onContinue={onContinue} onSaveResume={onSaveResume} canContinue={true} showBack={true} />
    </div>;
};
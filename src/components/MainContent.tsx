import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressForm } from './AddressForm';
import { LicenseBusinessInfoForm } from './LicenseBusinessInfoForm';
import { LicenseDetailsForm, LicenseDetailsData } from './LicenseDetailsForm';
import { BusinessOverviewForm, BusinessOverviewData } from './BusinessOverviewForm';
import { TeamFunctionForm, TeamFunctionData } from './TeamFunctionForm';
import { SponsorForm } from './SponsorForm';
import { PaymentInfoForm, PaymentInfoData } from './PaymentInfoForm';
import { DirectDepositForm, DirectDepositData } from './DirectDepositForm';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { MobileActionBar } from '@/components/MobileActionBar';
import { ReviewPage } from './ReviewPage';
import { W9Form, W9Data } from './W9Form';
import { DocumentSigningForm, DocumentSigningData } from './DocumentSigningForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

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

interface MainContentProps {
  currentSection: number;
  setCurrentSection: (section: number | ((prev: number) => number)) => void;
  completedSections: number[];
  setCompletedSections: (sections: number[] | ((prev: number[]) => number[])) => void;
  sections: string[];
  onFormSubmit?: (data: any) => void;
  onSaveResume?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  currentSection, 
  setCurrentSection, 
  completedSections, 
  setCompletedSections, 
  sections,
  onFormSubmit, 
  onSaveResume 
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [formComplete, setFormComplete] = useState(false);
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [licenseBusinessData, setLicenseBusinessData] = useState<LicenseBusinessData | null>(null);
  const [licenseDetailsData, setLicenseDetailsData] = useState<LicenseDetailsData>({});
  const [businessOverviewData, setBusinessOverviewData] = useState<BusinessOverviewData | null>(null);
  const [teamFunctionData, setTeamFunctionData] = useState<TeamFunctionData | null>(null);
  const [paymentInfoData, setPaymentInfoData] = useState<PaymentInfoData | null>(null);
  const [directDepositData, setDirectDepositData] = useState<DirectDepositData | null>(null);
  const [licenseBusinessFormComplete, setLicenseBusinessFormComplete] = useState(false);
  const [licenseDetailsFormComplete, setLicenseDetailsFormComplete] = useState(false);
  const [businessOverviewFormComplete, setBusinessOverviewFormComplete] = useState(false);
  const [teamFunctionFormComplete, setTeamFunctionFormComplete] = useState(false);
  const [sponsorFormComplete, setSponsorFormComplete] = useState(false);
  const [paymentInfoFormComplete, setPaymentInfoFormComplete] = useState(false);
  const [directDepositFormComplete, setDirectDepositFormComplete] = useState(false);
  const [w9Data, setW9Data] = useState<W9Data | null>(null);
  const [w9FormComplete, setW9FormComplete] = useState(false);
  const [documentSigningData, setDocumentSigningData] = useState<DocumentSigningData | null>(null);
  const [documentSigningComplete, setDocumentSigningComplete] = useState(false);

  const advancingRef = useRef(false);
  const lastContinueRef = useRef(0);
  const userInitiatedRef = useRef(false);

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    
    // Mark current section as completed
    if (!completedSections.includes(currentSection)) {
      setCompletedSections(prev => [...prev, currentSection]);
    }
    
    onFormSubmit?.(data);
  };

  const handleContinue = useCallback(() => {
    if (!userInitiatedRef.current) {
      console.log('🔒 Ignored continue: not user-initiated');
      return;
    }

    const now = Date.now();
    if (advancingRef.current || now - lastContinueRef.current < 600) {
      console.log('⏳ Continue throttled');
      return;
    }
    advancingRef.current = true;
    lastContinueRef.current = now;

    console.log('🎯 Continue clicked. Current section:', currentSection, {
      mailingAddressComplete: formComplete,
      licenseBusinessFormComplete,
      licenseDetailsFormComplete,
      businessOverviewFormComplete,
      teamFunctionFormComplete,
      sponsorFormComplete,
      paymentInfoFormComplete,
      directDepositFormComplete,
      w9FormComplete,
      documentSigningComplete,
    });
    // Guard: do not advance from step 1 unless the form is complete
    if (currentSection === 0 && !formComplete) {
      console.info('🚫 Continue blocked: Mailing Address incomplete');
      advancingRef.current = false;
      return;
    }
    
    // Guard: do not advance from step 2 unless the license business form is complete
    if (currentSection === 1 && !licenseBusinessFormComplete) {
      console.info('🚫 Continue blocked: License Business Info incomplete');
      advancingRef.current = false;
      return;
    }

    // Skip License Details if user is not currently licensed
    if (currentSection === 1 && licenseBusinessFormComplete && licenseBusinessData?.isLicensed === 'no') {
      console.log('⏭️ Skipping License Details - user not currently licensed');
      setCompletedSections((prev) => (prev.includes(currentSection) ? prev : [...prev, currentSection]));
      setCurrentSection(3); // Jump to Business Overview
      setTimeout(() => {
        advancingRef.current = false;
      }, 600);
      return;
    }

    // Guard: do not advance from step 3 unless the license details form is complete
    if (currentSection === 2 && !licenseDetailsFormComplete) {
      console.info('🚫 Continue blocked: License Details incomplete');
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 4 unless the business overview form is complete
    if (currentSection === 3 && !businessOverviewFormComplete) {
      console.info('🚫 Continue blocked: Business Overview incomplete');
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 5 unless the team function form is complete
    if (currentSection === 4 && !teamFunctionFormComplete) {
      console.info('🚫 Continue blocked: Team Function incomplete');
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 6 unless the sponsor form is complete
    if (currentSection === 5 && !sponsorFormComplete) {
      console.info('🚫 Continue blocked: Sponsor incomplete');
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 7 unless the payment info form is complete
    if (currentSection === 6 && !paymentInfoFormComplete) {
      console.info('🚫 Continue blocked: Payment Info incomplete');
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 8 unless the direct deposit form is complete
    if (currentSection === 7 && !directDepositFormComplete) {
      console.info('🚫 Continue blocked: Direct Deposit incomplete');
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 9 unless the W9 form is complete
    if (currentSection === 9 && !w9FormComplete) {
      console.info('🚫 Continue blocked: W9 incomplete');
      advancingRef.current = false;
      return;
    }

    // Handle final submission (Document Signing complete)
    if (currentSection === 10 && documentSigningComplete) {
      console.log('🎉 Application complete! All documents signed.');
      setCompletedSections((prev) => (prev.includes(currentSection) ? prev : [...prev, currentSection]));
      
      // Submit all collected data
      const finalData = {
        addressData,
        licenseBusinessData,
        licenseDetailsData,
        businessOverviewData,
        teamFunctionData,
        paymentInfoData,
        directDepositData,
        w9Data,
        documentSigningData,
      };
      
      console.log('📤 Submitting final application:', finalData);
      onFormSubmit?.(finalData);
      
      // Show success message
      toast({
        title: "Application Complete!",
        description: "Redirecting you to MY eXp to complete your setup...",
        duration: 3000,
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
      
      advancingRef.current = false;
      return;
    }

    // Guard: do not advance from step 10 unless document signing is complete
    if (currentSection === 10 && !documentSigningComplete) {
      console.info('🚫 Continue blocked: Document Signing incomplete');
      advancingRef.current = false;
      return;
    }

    // Check if returning from edit mode
    if (isEditingFromReview) {
      console.log('✅ Returning to Review page after edit');
      console.log('📊 Current data state:', { 
        addressData, 
        licenseBusinessData, 
        licenseDetailsData, 
        businessOverviewData,
        teamFunctionData,
        paymentInfoData,
        directDepositData
      });
      setCompletedSections((prev) => (prev.includes(currentSection) ? prev : [...prev, currentSection]));
      setIsEditingFromReview(false);
      setCurrentSection(8);
      setTimeout(() => {
        advancingRef.current = false;
      }, 600);
      return;
    }

    console.log('✅ Proceeding to next section');
    // Mark current section as completed using latest value
    setCompletedSections((prev) => (prev.includes(currentSection) ? prev : [...prev, currentSection]));
    // Navigate to next section safely with functional update
    setCurrentSection((prev) => {
      const newSection = Math.min(prev + 1, sections.length - 1);
      console.log('📍 Moving from section', prev, 'to section', newSection);
      return newSection;
    });

    // Release the lock after a short delay
    setTimeout(() => {
      advancingRef.current = false;
    }, 600);
  }, [currentSection, formComplete, licenseBusinessFormComplete, licenseDetailsFormComplete, businessOverviewFormComplete, teamFunctionFormComplete, sponsorFormComplete, paymentInfoFormComplete, directDepositFormComplete, w9FormComplete, documentSigningComplete, isEditingFromReview, licenseBusinessData?.isLicensed, sections.length, addressData, licenseBusinessData, licenseDetailsData, businessOverviewData, teamFunctionData, paymentInfoData, directDepositData, w9Data, documentSigningData, onFormSubmit]);

  const handleBack = () => {
    console.log('Back clicked');
    if (isEditingFromReview) {
      setIsEditingFromReview(false);
      setCurrentSection(8);
    } else {
      setCurrentSection((prev) => Math.max(prev - 1, 0));
    }
  };


  // Effect to update the continue handler and state
  
  const triggerUserContinue = useCallback(() => {
    userInitiatedRef.current = true;
    try {
      handleContinue();
    } finally {
      // Reset immediately after the call stack to ensure only explicit clicks pass
      setTimeout(() => {
        userInitiatedRef.current = false;
      }, 0);
    }
  }, [handleContinue]);

  // Conditional button text based on edit mode
  const continueButtonText = isEditingFromReview 
    ? (isMobile ? "Save & Return" : "Save & Return to Review")
    : currentSection === 10
    ? "Complete Application"
    : "Continue";

  return (
    <main className="items-stretch shadow-[2px_4px_6px_0_rgba(12,15,36,0.08)] flex min-w-60 flex-col flex-1 bg-white rounded-lg max-md:mx-0 max-md:rounded-lg max-md:shadow-sm overflow-auto">
      {/* Header section */}
      <div>
        <div className="px-2 pt-0 pb-0 max-md:px-2 max-md:pt-0 max-md:pb-0">
          <SectionHeader
            currentSection={currentSection}
            totalSections={sections.length}
            sectionTitle={sections[currentSection]}
          />
        </div>
      </div>

      {/* Form content with padding */}
      <section className="p-4 pt-0 overflow-y-auto flex-1">
        {currentSection === 0 && (
          <AddressForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={formComplete}
            initialData={addressData || undefined}
            onFormDataChange={setAddressData}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 1 && (
          <LicenseBusinessInfoForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setLicenseBusinessFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={licenseBusinessFormComplete}
            initialData={licenseBusinessData || undefined}
            onFormDataChange={setLicenseBusinessData}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 2 && (
          <LicenseDetailsForm
            licensedStates={
              licenseBusinessData?.isLicensed === 'yes' 
                ? licenseBusinessData?.licensedStates || []
                : licenseBusinessData?.plannedLicenseStates || []
            }
            data={licenseDetailsData}
            onDataChange={setLicenseDetailsData}
            onFormValidChange={setLicenseDetailsFormComplete}
            onContinue={triggerUserContinue}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={licenseDetailsFormComplete}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 3 && (
          <BusinessOverviewForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setBusinessOverviewFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={businessOverviewFormComplete}
            initialData={businessOverviewData || undefined}
            onFormDataChange={setBusinessOverviewData}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 4 && (
          <TeamFunctionForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setTeamFunctionFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={teamFunctionFormComplete}
            initialData={teamFunctionData || undefined}
            onFormDataChange={setTeamFunctionData}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 5 && (
          <SponsorForm
            onContinue={triggerUserContinue}
            onFormValidChange={setSponsorFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={sponsorFormComplete}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 6 && (
          <PaymentInfoForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setPaymentInfoFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={paymentInfoFormComplete}
            initialData={paymentInfoData || undefined}
            onFormDataChange={setPaymentInfoData}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 7 && (
          <DirectDepositForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setDirectDepositFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={directDepositFormComplete}
            initialData={directDepositData || undefined}
            onFormDataChange={setDirectDepositData}
            previousBankAccount={
              paymentInfoData?.paymentMethods.find(m => m.type === 'bank-account')
                ? {
                    accountNumber: paymentInfoData.paymentMethods.find(m => m.type === 'bank-account')?.details.accountNumber || '',
                    routingNumber: paymentInfoData.paymentMethods.find(m => m.type === 'bank-account')?.details.routingNumber || ''
                  }
                : undefined
            }
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 8 && (
          <ReviewPage
            addressData={addressData}
            licenseBusinessData={licenseBusinessData}
            licenseDetailsData={licenseDetailsData}
            businessOverviewData={businessOverviewData}
            teamFunctionData={teamFunctionData}
            paymentInfoData={paymentInfoData}
            directDepositData={directDepositData}
            onEdit={(section) => {
              console.log('📝 Edit clicked. Current data:', { 
                addressData, 
                licenseBusinessData, 
                licenseDetailsData, 
                businessOverviewData,
                teamFunctionData,
                paymentInfoData,
                directDepositData
              });
              setIsEditingFromReview(true);
              setCurrentSection(section);
            }}
            onBack={handleBack}
            onContinue={triggerUserContinue}
            onSaveResume={onSaveResume}
          />
        )}
        {currentSection === 9 && (
          <W9Form
            onContinue={triggerUserContinue}
            onFormValidChange={setW9FormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={w9FormComplete}
            initialData={w9Data || undefined}
            onFormDataChange={setW9Data}
            continueButtonText={continueButtonText}
          />
        )}
        {currentSection === 10 && (
          <DocumentSigningForm
            onContinue={triggerUserContinue}
            onFormValidChange={setDocumentSigningComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            showBack={currentSection > 0}
            canContinue={documentSigningComplete}
            initialData={documentSigningData || undefined}
            onFormDataChange={setDocumentSigningData}
            continueButtonText={continueButtonText}
          />
        )}
      </section>


    </main>
  );
};
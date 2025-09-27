import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AddressForm } from './AddressForm';
import { LicenseBusinessInfoForm } from './LicenseBusinessInfoForm';
import { LicenseDetailsForm, LicenseDetailsData } from './LicenseDetailsForm';
import { SectionHeader } from './SectionHeader';
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

interface MainContentProps {
  onFormSubmit?: (data: any) => void;
  onSaveResume?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onFormSubmit, onSaveResume }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [formComplete, setFormComplete] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [licenseBusinessData, setLicenseBusinessData] = useState<LicenseBusinessData | null>(null);
  const [licenseDetailsData, setLicenseDetailsData] = useState<LicenseDetailsData>({});
  const [licenseBusinessFormComplete, setLicenseBusinessFormComplete] = useState(false);
  const [licenseDetailsFormComplete, setLicenseDetailsFormComplete] = useState(false);

  const sections = [
    'Mailing Address',
    'License Business Info',
    'License Details',
    'Business Disclosures',
    'Team Function'
  ];

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

    // Guard: do not advance from step 3 unless the license details form is complete
    if (currentSection === 2 && !licenseDetailsFormComplete) {
      console.info('🚫 Continue blocked: License Details incomplete');
      advancingRef.current = false;
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
  }, [currentSection, formComplete, licenseBusinessFormComplete, licenseDetailsFormComplete]);

  const handleBack = () => {
    console.log('Back clicked');
    setCurrentSection((prev) => Math.max(prev - 1, 0));
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

  // Ensure the wizard always starts at step 0 on first load
  useEffect(() => {
    setCurrentSection(0);
  }, []);
  // Safety guard: if somehow mounted at a later step with no progress, snap back to step 0
  useEffect(() => {
    if (currentSection !== 0 && completedSections.length === 0) {
      setCurrentSection(0);
    }
  }, [currentSection, completedSections.length]);

  return (
    <main className="items-stretch shadow-[2px_4px_6px_0_rgba(12,15,36,0.08)] flex min-w-60 flex-col flex-1 bg-white rounded-lg max-md:mx-0">
      {/* Sticky header section with smooth transition */}
      <div className="sticky top-16 bg-white z-40 transition-all duration-200">
        <div className="p-4 max-md:p-3">
          <header className="flex w-full items-center gap-[31px] text-[#0C0F24] justify-center max-md:max-w-full">
            <div className="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
              <h1 className="min-h-[30px] w-full text-2xl font-semibold leading-none max-md:max-w-full text-[#0C0F24]">
                Your Information
              </h1>
              <p className="text-[#0C0F24] text-sm font-normal leading-none max-md:max-w-full mt-1">
                License Business Information
              </p>
            </div>
          </header>

          <SectionHeader 
            currentSection={currentSection}
            totalSections={sections.length}
            sectionTitle={sections[currentSection]}
          />
        </div>
      </div>

      {/* Form content with padding */}
      <section className="p-4 max-md:p-3 pt-0">
        {currentSection === 0 && (
          <AddressForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            canContinue={formComplete}
            showBack={currentSection > 0}
            initialData={addressData || undefined}
            onFormDataChange={setAddressData}
          />
        )}
        {currentSection === 1 && (
          <LicenseBusinessInfoForm
            onSubmit={handleFormSubmit}
            onContinue={triggerUserContinue}
            onFormValidChange={setLicenseBusinessFormComplete}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            canContinue={licenseBusinessFormComplete}
            showBack={currentSection > 0}
            initialData={licenseBusinessData || undefined}
            onFormDataChange={setLicenseBusinessData}
          />
        )}
        {currentSection === 2 && (
          <LicenseDetailsForm
            licensedStates={licenseBusinessData?.licensedStates || []}
            data={licenseDetailsData}
            onDataChange={setLicenseDetailsData}
            onFormValidChange={setLicenseDetailsFormComplete}
            onContinue={triggerUserContinue}
            onSaveResume={onSaveResume}
            onBack={handleBack}
            canContinue={licenseDetailsFormComplete}
            showBack={currentSection > 0}
          />
        )}
        {currentSection === 3 && (
          <div className="relative">
            <div className="text-center py-8 text-[#858791] pb-24">
              Business Disclosure form will be implemented here.
            </div>
            <div className="sticky bottom-0 bg-white border-t border-border p-4 mt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  aria-label="Go back to previous step"
                >
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onSaveResume}
                    aria-label="Save and resume application later"
                  >
                    Save & Resume Later
                  </Button>
                  <Button
                    type="button"
                    onClick={triggerUserContinue}
                    aria-label="Continue to next step"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentSection === 4 && (
          <div className="relative">
            <div className="text-center py-8 text-[#858791] pb-24">
              Team Function form will be implemented here.
            </div>
            <div className="sticky bottom-0 bg-white border-t border-border p-4 mt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  aria-label="Go back to previous step"
                >
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onSaveResume}
                    aria-label="Save and resume application later"
                  >
                    Save & Resume Later
                  </Button>
                  <Button
                    type="button"
                    onClick={triggerUserContinue}
                    disabled={currentSection >= sections.length - 1}
                    aria-label="Continue to next step"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>


    </main>
  );
};
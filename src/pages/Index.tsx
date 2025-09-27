import React from 'react';
// Force rebuild
import { Header } from '@/components/Header';
import { SideNavigation } from '@/components/SideNavigation';
import { MainContent } from '@/components/MainContent';
import { MobileProgressStepper } from '@/components/MobileProgressStepper';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleSaveResume = () => {
    console.log('Save & Resume Later clicked');
    // Implement save functionality
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    // Handle form submission
  };

  return (
    <div className="bg-[rgba(239,241,247,1)] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="flex w-full flex-col items-stretch px-6 max-md:px-3 pb-6 max-md:pb-4">
        <div className="flex w-full flex-col items-stretch">
          {/* Mobile progress stepper */}
          <div className="md:hidden sticky top-20 z-50 mt-2 bg-[rgba(239,241,247,1)] pt-2 pb-2">
            <MobileProgressStepper currentStep={0} progress={0} />
          </div>

          <div className="flex w-full gap-6 flex-wrap mt-4 max-md:flex-col max-md:gap-4 max-md:mt-0">
            {/* Desktop sticky sidebar */}
            <div className="max-md:hidden sticky top-20 self-start">
              <SideNavigation currentStep={0} progress={0} />
            </div>
            <MainContent 
              key="wizard-v1"
              onFormSubmit={handleFormSubmit} 
              onSaveResume={handleSaveResume}
            />
          </div>
        </div>
        
        {/* Help button - responsive positioning */}
        <div className="fixed bottom-24 right-4 md:right-6 z-50 items-center flex w-12 gap-2.5 h-12 bg-[#1B489B] hover:bg-[#1B489B]/90 transition-all duration-200 p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer max-md:bottom-20 max-md:w-10 max-md:h-10 max-md:p-2">
          <img
            src="https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/242fb18f3dcdc98a5033003d6aff07157272cfbf?placeholderIfAbsent=true"
            alt="Help or Support"
            className="aspect-[1] object-contain w-6 self-stretch my-auto max-md:w-5"
          />
        </div>
      </div>
      
    </div>
  );
};

export default Index;

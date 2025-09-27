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
    <div className="bg-[rgba(239,241,247,1)] overflow-hidden min-h-screen">
      <Header />
      
      <div className="flex w-full flex-col items-stretch px-6 max-md:px-4">
      <div className="flex w-full flex-col items-stretch">
        {/* Mobile progress stepper */}
        <div className="md:hidden mt-4">
          <MobileProgressStepper currentStep={0} progress={0} />
        </div>

        <div className="flex w-full gap-6 flex-wrap mt-4 max-md:flex-col max-md:gap-4 max-md:mt-0">
            {/* Desktop sidebar */}
            <div className="max-md:hidden">
              <SideNavigation currentStep={0} progress={0} />
            </div>
            <MainContent 
              key="wizard-v1"
              onFormSubmit={handleFormSubmit} 
              onSaveResume={handleSaveResume}
            />
          </div>
        </div>
        
        <div className="items-center flex w-10 gap-2.5 h-10 bg-[#1B489B] mt-6 p-2 rounded-full ml-auto max-md:fixed max-md:bottom-32 max-md:right-4 max-md:shadow-lg">
          <img
            src="https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/242fb18f3dcdc98a5033003d6aff07157272cfbf?placeholderIfAbsent=true"
            alt="Help or Support"
            className="aspect-[1] object-contain w-8 self-stretch my-auto"
          />
        </div>
      </div>
      
    </div>
  );
};

export default Index;

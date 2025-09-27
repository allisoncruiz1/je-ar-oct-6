import React from 'react';
import { Header } from '@/components/Header';
import { SideNavigation } from '@/components/SideNavigation';
import { MainContent } from '@/components/MainContent';

const Index = () => {
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
      <div className="flex w-full flex-col items-stretch px-6 max-md:max-w-full max-md:px-5">
        <div className="flex w-full flex-col items-stretch max-md:max-w-full">
          <div className="self-center w-full text-sm text-[#0C0F24] font-normal leading-none max-md:max-w-full">
            <Header onSaveResume={handleSaveResume} />
          </div>
          
          <div className="flex w-full gap-[196px_24px] flex-wrap mt-6 max-md:max-w-full">
            <SideNavigation currentStep={0} progress={0} />
            <MainContent onFormSubmit={handleFormSubmit} />
          </div>
        </div>
        
        <div className="items-center flex w-[52px] gap-2.5 h-[52px] bg-[#1B489B] mt-[193px] p-2.5 rounded-[464px] max-md:mt-10">
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

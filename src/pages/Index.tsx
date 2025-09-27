import React, { useState } from 'react';
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[rgba(239,241,247,1)] overflow-hidden min-h-screen">
      <Header onSaveResume={handleSaveResume} />
      
      <div className="flex w-full flex-col items-stretch px-6 max-md:px-4">
        <div className="flex w-full flex-col items-stretch">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center gap-2 mt-4 p-2 bg-white rounded-lg shadow-sm"
          >
            <div className="w-5 h-5 flex flex-col justify-center">
              <div className="w-full h-0.5 bg-[#0C0F24] mb-1"></div>
              <div className="w-full h-0.5 bg-[#0C0F24] mb-1"></div>
              <div className="w-full h-0.5 bg-[#0C0F24]"></div>
            </div>
            <span className="text-sm font-medium text-[#0C0F24]">Menu</span>
          </button>

          {/* Mobile sidebar overlay */}
          {isSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}>
              <div className="absolute left-0 top-0 h-full w-[280px] bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="float-right text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <SideNavigation currentStep={0} progress={0} />
              </div>
            </div>
          )}

          <div className="flex w-full gap-6 flex-wrap mt-4 max-md:flex-col max-md:gap-4">
            {/* Desktop sidebar */}
            <div className="max-md:hidden">
              <SideNavigation currentStep={0} progress={0} />
            </div>
            <MainContent onFormSubmit={handleFormSubmit} />
          </div>
        </div>
        
        <div className="items-center flex w-[52px] gap-2.5 h-[52px] bg-[#1B489B] mt-6 p-2.5 rounded-[464px] max-md:mt-6 ml-auto max-md:fixed max-md:bottom-6 max-md:right-6 max-md:shadow-lg">
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

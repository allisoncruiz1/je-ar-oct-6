import React from 'react';

interface HeaderProps {
  onSaveResume?: () => void;
  currentStep?: number;
  progress?: number;
}

export const Header: React.FC<HeaderProps> = ({ onSaveResume, currentStep = 0, progress = 0 }) => {
  const steps = [
    { title: "Get Started", description: "Welcome" },
    { title: "Address", description: "Your location" },
    { title: "Property Details", description: "Home info" },
    { title: "Documents", description: "Upload files" },
    { title: "Review", description: "Final check" }
  ];

  return (
    <header className="bg-[#0C0F24] w-full">
      {/* Logo bar */}
      <div className="flex min-h-16 items-center gap-[40px_100px] justify-between flex-wrap px-6 py-4 max-md:max-w-full max-md:px-5">
        <img
          src="https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/f933203b4f207a84373cadba0036fbf92cea1c77?placeholderIfAbsent=true"
          alt="Company Logo"
          className="aspect-[1.97] object-contain w-[63px] self-stretch shrink-0 my-auto"
        />
      </div>
      
      {/* Mobile progress stepper integrated */}
      <div className="md:hidden bg-[#0C0F24] px-6 pb-3 max-md:px-5">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          {/* Current step indicator */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Step {currentStep + 1} of {steps.length}
              </h3>
              <p className="text-xs text-white/70">
                {steps[currentStep]?.title}
              </p>
            </div>
            <div className="text-xs font-semibold text-white">
              {progress}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white/20 h-1.5 rounded-full mb-2">
            <div 
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                  index <= currentStep 
                    ? 'bg-white text-[#0C0F24]' 
                    : 'bg-white/20 text-white/50'
                }`}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

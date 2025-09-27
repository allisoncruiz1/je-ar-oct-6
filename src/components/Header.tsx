import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HeaderProps {
  onSaveResume?: () => void;
  onHelpClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSaveResume, onHelpClick }) => {
  return (
    <header className="bg-[#0C0F24] flex min-h-16 w-full items-center gap-[40px_100px] justify-between flex-wrap px-6 py-4 max-md:max-w-full max-md:px-5">
      <img
        src="https://api.builder.io/api/v1/image/assets/7ef6bd28ffce4d1e9df8b15ae0b59f98/f933203b4f207a84373cadba0036fbf92cea1c77?placeholderIfAbsent=true"
        alt="Company Logo"
        className="aspect-[1.97] object-contain w-[63px] self-stretch shrink-0 my-auto"
      />
      
      <button
        onClick={onHelpClick}
        className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 transition-all duration-200 rounded-full group"
        aria-label="Help and Support"
      >
        <HelpCircle 
          size={20} 
          className="text-white group-hover:text-white transition-colors duration-200" 
        />
      </button>
    </header>
  );
};

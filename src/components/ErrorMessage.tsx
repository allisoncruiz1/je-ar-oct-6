import React from 'react';

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = "" }) => {
  if (!message) return null;
  
  return (
    <p className={`text-sm font-medium text-destructive mt-1 ${className}`}>
      {message}
    </p>
  );
};

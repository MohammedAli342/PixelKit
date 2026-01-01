
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClear?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClear, className }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center justify-between gap-4 animate-fadeIn ${className}`}>
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClear && (
        <button onClick={onClear} className="p-1 rounded-full hover:bg-red-500/20 transition-colors" aria-label="Dismiss error">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

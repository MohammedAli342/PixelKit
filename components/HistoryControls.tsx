
import React from 'react';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({ onUndo, onRedo, canUndo, canRedo, className }) => {
  const buttonClass = "p-2 rounded-full bg-slate-700/50 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-slate-600";
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={onUndo} disabled={!canUndo} className={buttonClass} aria-label="Undo">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8A5 5 0 0118 18v-1" />
        </svg>
      </button>
      <button onClick={onRedo} disabled={!canRedo} className={buttonClass} aria-label="Redo">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8a5 5 0 00-5 5v1" />
        </svg>
      </button>
    </div>
  );
};

export default HistoryControls;

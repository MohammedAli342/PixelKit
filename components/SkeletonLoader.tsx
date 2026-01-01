
import React from 'react';

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-800 rounded-md ${className}`}>
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
      ></div>
    </div>
  );
};

export default SkeletonLoader;
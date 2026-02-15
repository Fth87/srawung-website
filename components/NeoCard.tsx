import React from 'react';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  title?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({ 
  children, 
  className = '', 
  color = 'bg-white',
  title
}) => {
  return (
    <div className={`border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${color} p-6 ${className}`}>
      {title && (
        <div className="border-b-2 border-black pb-2 mb-4">
          <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
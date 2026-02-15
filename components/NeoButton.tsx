import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyles = "font-bold text-lg px-6 py-3 border-2 border-black transition-all duration-200 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    primary: "bg-[#CCFF00] hover:bg-[#b3e600] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    secondary: "bg-white hover:bg-gray-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    accent: "bg-[#00FFFF] hover:bg-[#00e6e6] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    danger: "bg-[#FF00FF] hover:bg-[#e600e6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
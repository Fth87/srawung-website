import React from 'react';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface NeoTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold mb-1 text-sm uppercase tracking-wide">{label}</label>
      <input 
        className={`w-full bg-white border-2 border-black p-3 font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow ${className}`}
        {...props}
      />
    </div>
  );
};

export const NeoTextArea: React.FC<NeoTextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold mb-1 text-sm uppercase tracking-wide">{label}</label>
      <textarea 
        className={`w-full bg-white border-2 border-black p-3 font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow ${className}`}
        rows={4}
        {...props}
      />
    </div>
  );
};
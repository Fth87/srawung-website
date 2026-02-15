import React, { useState } from 'react';
import { NeoButton } from './NeoButton';
import { Role } from '../types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  projectName: string;
}

const PLATFORMS = [
  {
    name: 'JobStreet',
    color: 'bg-[#FFEB3B]', // Yellow
    url: 'https://www.jobstreet.co.id/id/employers/login',
    logo: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" />
  },
  {
    name: 'LinkedIn',
    color: 'bg-[#0077B5]', // LinkedIn Blue
    textColor: 'text-white',
    url: 'https://www.linkedin.com/sharing/share-offsite/?url=', // Will use feed share
    isSocial: true,
    logo: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  },
  {
    name: 'Indeed',
    color: 'bg-[#2164f3]', // Indeed Blue
    textColor: 'text-white',
    url: 'https://id.indeed.com/hire',
    logo: <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,17c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1 s1,0.45,1,1v4C13,16.55,12.55,17,12,17z M12,9c-0.55,0-1-0.45-1-1V7c0-0.55,0.45-1,1-1s1,0.45,1,1v1C13,8.55,12.55,9,12,9z" />
  },
  {
    name: 'Glints',
    color: 'bg-[#EC2027]', // Glints Red
    textColor: 'text-white',
    url: 'https://employers.glints.id/',
    logo: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  },
  {
    name: 'Dealls',
    color: 'bg-[#6B46C1]', // Purple
    textColor: 'text-white',
    url: 'https://dealls.com/employers',
    logo: <path d="M12,2L2,7l10,5l10-5L12,2z M2,17l10,5l10-5M2,12l10,5l10-5"/>
  },
  {
    name: 'Kalibrr',
    color: 'bg-[#00A1DE]', // Cyan
    textColor: 'text-white',
    url: 'https://www.kalibrr.com/employers',
    logo: <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M11,17H7v-6h4v2h2v-2h4 v6h-4v-2h-2V17z"/>
  }
];

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, role, projectName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jobText = `[HIRING] ${role.title} at ${projectName}\n\n${role.recruitmentBlurb || role.description}\n\n#hiring #startup #srawung`;

  const handleCopy = () => {
    navigator.clipboard.writeText(jobText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformClick = (platform: typeof PLATFORMS[0]) => {
    // 1. Auto copy the text first for user convenience
    navigator.clipboard.writeText(jobText);
    
    // 2. Open link
    if (platform.isSocial) {
      const encoded = encodeURIComponent(jobText);
      if (platform.name === 'LinkedIn') {
         // Use feed share
         window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encoded}`, '_blank');
      }
    } else {
       // For job boards, we redirect to their "Post Job" or "Login" page
       window.open(platform.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
           <h3 className="text-2xl font-black uppercase">POST VACANCY</h3>
           <button onClick={onClose} className="text-white hover:text-[#CCFF00] font-bold text-xl">✕</button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-gray-100 p-4 border-2 border-black border-dashed">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">CONTENT PREVIEW</h4>
            <p className="text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">{jobText}</p>
          </div>

          <h4 className="text-lg font-bold mb-4 uppercase">Select Platform to Auto-Post</h4>
          <p className="text-xs text-gray-500 mb-4">*We will copy the text to your clipboard, then redirect you to the platform.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handlePlatformClick(platform)}
                className={`
                  ${platform.color} ${platform.textColor || 'text-black'}
                  border-2 border-black p-4 flex flex-col items-center justify-center gap-3
                  hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all
                  group
                `}
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">{platform.logo}</svg>
                <span className="font-bold uppercase tracking-tight">{platform.name}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
             <NeoButton 
               onClick={handleCopy} 
               className="flex-1 flex items-center justify-center gap-2"
               variant="primary"
             >
               {copied ? "COPIED TO CLIPBOARD!" : "COPY TEXT ONLY"}
             </NeoButton>
             <NeoButton onClick={onClose} variant="secondary">
               CANCEL
             </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
};

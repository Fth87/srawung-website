import React from 'react';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';
import { ViewState } from '../types';

interface PricingProps {
  onBack: () => void;
  onSelectTier: (tier: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onBack, onSelectTier }) => {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase">Choose Your Power</h2>
        <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto">
          Whether you are a solo visionary or a scaling studio, we have the orchestration engine for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STARTER */}
        <NeoCard className="flex flex-col relative">
          <div className="absolute top-0 right-0 bg-gray-200 text-xs font-bold px-2 py-1 border-l-2 border-b-2 border-black">FREE</div>
          <h3 className="text-3xl font-black mb-2">STARTER</h3>
          <p className="text-sm font-bold text-gray-500 mb-6">FOR SOLO HACKERS</p>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex gap-2 text-sm font-medium">✅ 1 Active Project</li>
            <li className="flex gap-2 text-sm font-medium">✅ Max 5 Team Members</li>
            <li className="flex gap-2 text-sm font-medium">✅ Basic Solo Founder Mode</li>
            <li className="flex gap-2 text-sm font-medium">❌ Data Export</li>
          </ul>
          <NeoButton onClick={() => onSelectTier('STARTER')} variant="secondary" className="w-full">
            START FREE
          </NeoButton>
        </NeoCard>

        {/* PRO */}
        <NeoCard className="flex flex-col bg-[#CCFF00] transform md:-translate-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1">POPULAR</div>
          <h3 className="text-3xl font-black mb-2">PRO</h3>
          <p className="text-sm font-bold text-black mb-6">FOR TEAM LEADS</p>
          <ul className="space-y-3 mb-8 flex-grow">
            <li className="flex gap-2 text-sm font-bold">✅ 5 Active Projects</li>
            <li className="flex gap-2 text-sm font-bold">✅ Unlimited CV Uploads</li>
            <li className="flex gap-2 text-sm font-bold">✅ Advanced Skill Verification</li>
            <li className="flex gap-2 text-sm font-bold">✅ Assignment Reasoning Engine</li>
            <li className="flex gap-2 text-sm font-bold">✅ Full Export Capabilities</li>
          </ul>
          <NeoButton onClick={() => onSelectTier('PRO')} className="w-full bg-white hover:bg-gray-100">
            GO PRO ($19/mo)
          </NeoButton>
        </NeoCard>

        {/* STUDIO */}
        <NeoCard className="flex flex-col bg-black text-white">
          <h3 className="text-3xl font-black mb-2 text-[#00FFFF]">STUDIO</h3>
          <p className="text-sm font-bold text-gray-400 mb-6">FOR AGENCIES</p>
          <ul className="space-y-3 mb-8 flex-grow text-gray-200">
            <li className="flex gap-2 text-sm font-medium">✅ Unlimited Projects</li>
            <li className="flex gap-2 text-sm font-medium">✅ Skill Gap Analysis</li>
            <li className="flex gap-2 text-sm font-medium">✅ Priority Support</li>
            <li className="flex gap-2 text-sm font-medium">✅ Custom Workflows</li>
          </ul>
          <NeoButton onClick={() => onSelectTier('STUDIO')} variant="accent" className="w-full">
            CONTACT SALES
          </NeoButton>
        </NeoCard>
      </div>

      <div className="text-center mt-8">
         <button onClick={onBack} className="underline font-bold hover:bg-black hover:text-white px-2">Back to Home</button>
      </div>
    </div>
  );
};
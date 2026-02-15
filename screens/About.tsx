import React from 'react';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-l-4 border-black pl-6 py-4">
        <h2 className="text-6xl font-black tracking-tighter mb-2">SRAWUNG</h2>
        <p className="text-2xl font-bold text-gray-500 italic">/sra·wung/ • (Javanese)</p>
        <p className="text-xl font-medium mt-2">To gather, socialize, and mix with others.</p>
      </div>

      <NeoCard className="bg-white">
        <h3 className="text-3xl font-bold mb-4">THE PHILOSOPHY</h3>
        <p className="text-lg leading-relaxed mb-6">
          Building software is inherently social. Yet, the process of starting a project is often bogged down by administrative chaos. 
          Who does what? What do we need to build first? Are we aligned?
        </p>
        <p className="text-lg leading-relaxed mb-6">
          <strong>Srawung</strong> is an experiment in "Brutalist Efficiency". We strip away the corporate fluff of project management tools. 
          We use AI not to replace the team, but to <strong>facilitate the gathering</strong>.
        </p>
        <p className="text-lg leading-relaxed">
          We believe that when the right people gather around a clear idea, magic happens. We just provide the blueprint.
        </p>
      </NeoCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeoCard title="STACK" color="bg-[#E0E7FF]">
          <ul className="font-mono text-sm space-y-2">
            <li>React 19</li>
            <li>Tailwind CSS</li>
            <li>Google Gemini 1.5 Pro</li>
            <li>Neo-Brutalist Design System</li>
          </ul>
        </NeoCard>
        
        <NeoCard title="CREDITS" color="bg-[#FFE0E0]">
          <p className="font-medium">
            Designed for the builders, the hackers, and the weekend warriors.
            <br/><br/>
            © 2025 Srawung Corp.
          </p>
        </NeoCard>
      </div>

      <div className="text-center pt-8">
        <NeoButton onClick={onBack} className="w-full md:w-auto">BACK TO APP</NeoButton>
      </div>
    </div>
  );
};
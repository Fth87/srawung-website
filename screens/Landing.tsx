import React from 'react';
import { NeoButton } from '../components/NeoButton';
import { NeoCard } from '../components/NeoCard';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col gap-12 py-10">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            BUILD TEAMS <br/>
            <span className="bg-[#CCFF00] px-2">FAST.</span>
          </h2>
          <p className="text-xl font-medium max-w-md border-l-4 border-black pl-4">
            No more endless meetings. AI-generated roles, tasks, and alignment plans in seconds.
            Pure output. No fluff.
          </p>
          <div className="flex gap-4 pt-4">
             <NeoButton onClick={onStart} className="text-xl py-4 px-8">LEARN MORE</NeoButton>
          </div>
        </div>
        <div className="relative">
           <div className="absolute top-0 left-0 w-full h-full bg-[#00FFFF] border-2 border-black translate-x-4 translate-y-4 -z-10"></div>
           <NeoCard className="aspect-square flex flex-col justify-center items-center gap-6 bg-white">
              <div className="w-24 h-24 bg-[#FF00FF] rounded-full border-2 border-black flex items-center justify-center font-bold text-4xl text-white">1</div>
              <div className="w-24 h-24 bg-[#FFFF00] rect border-2 border-black flex items-center justify-center font-bold text-4xl">2</div>
              <div className="w-24 h-24 bg-[#CCFF00] polygon border-2 border-black flex items-center justify-center font-bold text-4xl">3</div>
           </NeoCard>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NeoCard title="1. DEFINE IDEA" color="bg-[#FF90E8]">
           Describe your chaotic idea. We organize it.
        </NeoCard>
        <NeoCard title="2. INVITE SQUAD" color="bg-[#90E8FF]">
           Send a link. They take a 30s AI assessment.
        </NeoCard>
        <NeoCard title="3. GET PLAN" color="bg-[#90FF95]">
           Roles, Task Lists, and Milestones generated instantly.
        </NeoCard>
      </section>
    </div>
  );
};
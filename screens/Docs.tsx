import React from 'react';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';
import { ViewState } from '../types';

interface DocsProps {
  onBack: () => void;
}

export const Docs: React.FC<DocsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b-2 border-black pb-4">
        <h2 className="text-5xl font-black">HOW TO SRAWUNG</h2>
        <NeoButton onClick={onBack} variant="secondary">BACK HOME</NeoButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <NeoCard title="1. THE VISION" color="bg-[#FF90E8]">
          <p className="font-medium text-lg leading-relaxed">
            Every great team starts with a chaotic idea. Start by creating a project and describing your goal in plain English. 
            <br/><br/>
            Our AI analyzes your description to understand the technical and operational requirements needed to build it.
          </p>
        </NeoCard>

        <NeoCard title="2. THE SQUAD" color="bg-[#90E8FF]">
          <p className="font-medium text-lg leading-relaxed">
            Invite your friends, colleagues, or internet strangers. Srawung generates a custom <strong>Assessment Form</strong> for your project.
            <br/><br/>
            Team members answer specific multiple-choice questions about their skills, availability, and preferences relative to your specific idea.
          </p>
        </NeoCard>

        <NeoCard title="3. THE INTELLIGENCE" color="bg-[#90FF95]">
          <p className="font-medium text-lg leading-relaxed">
            Once your team has joined, hit <strong>Generate Plan</strong>.
            <br/><br/>
            We use Gemini 1.5 Pro to analyze everyone's profiles against the project needs. We assign roles based on actual strengths, not just job titles.
          </p>
        </NeoCard>

        <NeoCard title="4. THE EXECUTION" color="bg-[#FFFF00]">
          <p className="font-medium text-lg leading-relaxed">
            Walk away with a concrete <strong>Action Plan</strong>:
            <ul className="list-disc list-inside mt-2 font-bold">
              <li>Assigned Roles</li>
              <li>MVP Task List</li>
              <li>Milestone Timeline</li>
            </ul>
          </p>
        </NeoCard>
      </div>

      <NeoCard className="bg-black text-white mt-8">
        <h3 className="text-2xl font-bold mb-2">PRO TIP</h3>
        <p className="text-gray-300">
          The quality of the plan depends on the quality of your project description. Be specific about what you want to build (e.g., "A mobile app for dog walkers using React Native") rather than vague concepts.
        </p>
      </NeoCard>
    </div>
  );
};
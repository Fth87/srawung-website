import React, { useState } from 'react';
import { NeoButton } from '../components/NeoButton';
import { NeoInput, NeoTextArea } from '../components/NeoInput';
import { NeoCard } from '../components/NeoCard';
import { generateAssessmentQuestions } from '../services/geminiService';
import { Project, ProjectMode } from '../types';

interface ProjectSetupProps {
  onProjectCreated: (project: Project) => void;
  onCancel: () => void;
}

export const ProjectSetup: React.FC<ProjectSetupProps> = ({ onProjectCreated, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [mode, setMode] = useState<ProjectMode | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [loading, setLoading] = useState(false);

  const handleModeSelect = (selectedMode: ProjectMode) => {
    setMode(selectedMode);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !mode) return;

    setLoading(true);
    try {
      const questions = await generateAssessmentQuestions(description, name, mode);
      
      const newProject: Project = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        description,
        mode,
        techStack,
        questions,
        members: [],
        createdAt: Date.now(),
      };
      
      onProjectCreated(newProject);
    } catch (error) {
      alert("Failed to generate questions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-5xl font-black text-center mb-2 uppercase">Choose Your Mission</h2>
        <p className="text-center text-xl text-gray-600 mb-10 font-medium">How do you want Srawung to help you today?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MODE A */}
          <button 
            onClick={() => handleModeSelect('TEAM')}
            className="text-left group transition-all duration-300 hover:-translate-y-2"
          >
            <NeoCard className="h-full bg-[#CCFF00] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-bold text-sm">MODE A</div>
               <div className="mb-6 mt-2">
                 <span className="text-6xl">🤝</span>
               </div>
               <h3 className="text-3xl font-black mb-3">I HAVE A TEAM</h3>
               <p className="font-bold text-sm text-gray-800 mb-4 border-b-2 border-black pb-4">
                 FOR TEAM LEADS & MANAGERS
               </p>
               <ul className="space-y-2 font-medium">
                 <li>✅ Audit existing member skills</li>
                 <li>✅ Auto-assign tasks based on data</li>
                 <li>✅ Eliminate assignment bias</li>
               </ul>
            </NeoCard>
          </button>

          {/* MODE B */}
          <button 
            onClick={() => handleModeSelect('SOLO')}
            className="text-left group transition-all duration-300 hover:-translate-y-2"
          >
            <NeoCard className="h-full bg-[#FF90E8] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-bold text-sm">MODE B</div>
               <div className="mb-6 mt-2">
                 <span className="text-6xl">🚀</span>
               </div>
               <h3 className="text-3xl font-black mb-3">I NEED A TEAM</h3>
               <p className="font-bold text-sm text-gray-800 mb-4 border-b-2 border-black pb-4">
                 FOR SOLO FOUNDERS
               </p>
               <ul className="space-y-2 font-medium">
                 <li>✅ Analyze business idea complexity</li>
                 <li>✅ Generate ideal team structure</li>
                 <li>✅ Create recruitment content</li>
               </ul>
            </NeoCard>
          </button>
        </div>
        
        <div className="text-center mt-12">
          <button onClick={onCancel} className="font-bold underline hover:bg-black hover:text-white px-2">CANCEL</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <NeoCard title={`NEW ${mode} PROJECT`} className="relative">
        <div className="absolute top-4 right-4 text-xs font-bold bg-black text-white px-2 py-1">STEP 2 OF 2</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeoInput 
            label="Project Name" 
            placeholder="e.g. Operation Doomsday App" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <NeoTextArea 
            label="The Big Idea & Requirements" 
            placeholder={mode === 'TEAM' 
              ? "Describe the project goals and technical needs so we can audit your team's fit." 
              : "Describe your startup vision. We will tell you who you need to hire."
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32"
            required
          />
          
          <NeoInput 
            label="Tech Preferences (Optional)" 
            placeholder="e.g. React, Python, AWS" 
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />
          
          <div className="mt-8 flex gap-4">
            <NeoButton type="submit" disabled={loading} className="flex-1">
              {loading ? "ANALYZING..." : mode === 'TEAM' ? "GENERATE ASSESSMENT" : "ANALYZE STRUCTURE"}
            </NeoButton>
            <NeoButton type="button" variant="secondary" onClick={() => setStep(1)}>
              BACK
            </NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  );
};
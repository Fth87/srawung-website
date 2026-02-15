import React, { useState } from 'react';
import { NeoButton } from '../components/NeoButton';
import { NeoInput } from '../components/NeoInput';
import { NeoCard } from '../components/NeoCard';
import { Project, TeamMember } from '../types';

interface MemberAssessmentProps {
  project: Project;
  onSubmit: (member: TeamMember) => void;
  onCancel: () => void;
}

export const MemberAssessment: React.FC<MemberAssessmentProps> = ({ project, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [answers, setAnswers] = useState<string[]>(new Array(project.questions.length).fill(''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !skills) return;
    
    // Check if all questions are answered
    if (answers.some(a => a === '')) {
       alert("Please answer all questions.");
       return;
    }

    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      skills,
      answers: project.questions.map((q, i) => ({ question: q.text, answer: answers[i] })),
    };
    
    onSubmit(newMember);
  };

  const handleAnswerChange = (index: number, val: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = val;
    setAnswers(newAnswers);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#FF00FF] border-2 border-black p-4 mb-8 text-white font-bold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        YOU ARE INVITED TO JOIN: <span className="text-black bg-white px-2 ml-2">{project.name}</span>
      </div>
      
      <NeoCard title="MEMBER ASSESSMENT">
        <form onSubmit={handleSubmit} className="space-y-6">
          <NeoInput 
            label="Your Name" 
            placeholder="John Doe" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <NeoInput 
            label="Core Skills (Comma Separated)" 
            placeholder="React, Design, Python, Marketing..." 
            value={skills} 
            onChange={e => setSkills(e.target.value)} 
          />
          
          <div className="border-t-2 border-black pt-6 space-y-8">
             <h4 className="font-black text-xl mb-4 bg-[#FFFF00] inline-block px-2 border border-black">PROJECT SPECIFIC QUESTIONS</h4>
             {project.questions.map((q, i) => (
                <div key={q.id || i} className="space-y-3">
                   <label className="block font-bold text-lg leading-tight uppercase">{`Q${i+1}: ${q.text}`}</label>
                   <div className="grid grid-cols-1 gap-2">
                     {q.options.map((option) => {
                       const isSelected = answers[i] === option;
                       return (
                         <label 
                            key={option} 
                            className={`
                              flex items-center gap-3 p-3 border-2 border-black cursor-pointer transition-all
                              ${isSelected 
                                ? 'bg-[#CCFF00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                                : 'bg-white hover:bg-gray-50'
                              }
                            `}
                         >
                            <input 
                              type="radio" 
                              name={`question-${q.id || i}`} 
                              value={option}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(i, option)}
                              className="hidden"
                            />
                            {/* Custom Radio Circle */}
                            <div className={`w-6 h-6 border-2 border-black flex items-center justify-center bg-white rounded-full flex-shrink-0`}>
                                <div className={`w-3 h-3 bg-black rounded-full transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}></div>
                            </div>
                            <span className="font-medium text-lg leading-snug">{option}</span>
                         </label>
                       );
                     })}
                   </div>
                </div>
             ))}
          </div>

          <div className="flex gap-4 mt-8">
             <NeoButton type="submit" className="flex-1">SUBMIT & JOIN</NeoButton>
             <NeoButton type="button" variant="secondary" onClick={onCancel}>CANCEL</NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  );
};
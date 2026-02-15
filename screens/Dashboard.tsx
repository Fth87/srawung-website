import React from 'react';
import { NeoButton } from '../components/NeoButton';
import { NeoCard } from '../components/NeoCard';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onCreateNew: () => void;
  onSelectProject: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateNew, onSelectProject }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black italic">YOUR PROJECTS</h2>
        <NeoButton onClick={onCreateNew} variant="accent">+ NEW PROJECT</NeoButton>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-black bg-white">
          <p className="text-2xl font-bold text-gray-400 mb-4">NOTHING HERE YET</p>
          <NeoButton onClick={onCreateNew}>START SOMETHING</NeoButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="relative group cursor-pointer" onClick={() => onSelectProject(p.id)}>
               <div className="absolute top-0 left-0 w-full h-full bg-black translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
               <NeoCard className="relative h-full hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                  <h3 className="text-2xl font-bold mb-2 truncate">{p.name}</h3>
                  <p className="text-sm font-medium text-gray-600 line-clamp-3 mb-4 min-h-[4.5rem]">
                    {p.description}
                  </p>
                  <div className="flex justify-between items-center border-t-2 border-black pt-4 mt-auto">
                    <span className="font-bold bg-[#CCFF00] px-2 border border-black text-xs">
                      {p.members.length} MEMBERS
                    </span>
                    <span className="text-xs font-bold">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
               </NeoCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
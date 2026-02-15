import React, { useState } from 'react';
import { NeoButton } from '../components/NeoButton';
import { NeoCard } from '../components/NeoCard';
import { Project, Role } from '../types';
import { generateProjectPlan } from '../services/geminiService';
import { ShareDialog } from '../components/ShareDialog';
import { ExportDialog } from '../components/ExportDialog';

interface ProjectResultsProps {
  project: Project;
  isMemberView?: boolean;
  onUpdateProject: (updatedProject: Project) => void;
  onBack: () => void;
  onJoinAsMember: () => void;
}

export const ProjectResults: React.FC<ProjectResultsProps> = ({ 
  project, 
  isMemberView, 
  onUpdateProject, 
  onBack,
  onJoinAsMember
}) => {
  const [generating, setGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('INITIALIZING...');
  
  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeShareRole, setActiveShareRole] = useState<Role | null>(null);

  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const isSoloMode = project.mode === 'SOLO';

  const handleGeneratePlan = async () => {
    setGenerating(true);
    setLoadingText('ANALYZING REQUIREMENTS...');
    
    const steps = isSoloMode 
      ? ['ANALYZING COMPLEXITY...', 'DRAFTING ORG CHART...', 'WRITING JOB POSTS...', 'FINALIZING PLAN...']
      : ['AUDITING TEAM SKILLS...', 'MATCHING TASKS...', 'GENERATING ASSIGNMENTS...', 'FINALIZING PLAN...'];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingText(steps[stepIndex]);
        stepIndex++;
      }
    }, 800);

    try {
      const plan = await generateProjectPlan(project);
      onUpdateProject({ ...project, plan });
    } catch (error) {
      alert("Error generating plan. Please try again.");
      console.error(error);
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  };

  const copyLink = () => {
    alert(`Link copied: ${window.location.origin}/#/project/${project.id}`);
  };

  const openShareModal = (role: Role) => {
    setActiveShareRole(role);
    setShareModalOpen(true);
  };

  // Toggle Filled Status for Mode B
  const toggleRoleStatus = (roleIndex: number) => {
    if (!project.plan) return;
    
    const updatedRoles = [...project.plan.roles];
    updatedRoles[roleIndex].isFilled = !updatedRoles[roleIndex].isFilled;
    
    const updatedProject = {
      ...project,
      plan: {
        ...project.plan,
        roles: updatedRoles
      }
    };
    onUpdateProject(updatedProject);
  };

  const filledCount = project.plan?.roles.filter(r => r.isFilled).length || 0;
  const totalRoles = project.plan?.roles.length || 0;
  const progressPercent = totalRoles > 0 ? (filledCount / totalRoles) * 100 : 0;

  return (
    <div className="space-y-8 relative">
      {/* Share Dialog (Mode B) */}
      {activeShareRole && (
        <ShareDialog 
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          role={activeShareRole}
          projectName={project.name}
        />
      )}

      {/* Export Dialog (Mode A) */}
      {project.plan && !isSoloMode && (
        <ExportDialog
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          tasks={project.plan.tasks}
          project={project}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <button onClick={onBack} className="hover:bg-gray-200 p-1 border border-transparent hover:border-black transition-all">← BACK</button>
             <span className={`px-2 py-0.5 text-sm font-bold border border-black ${project.plan ? 'bg-[#CCFF00]' : 'bg-gray-200'}`}>
               MODE: {isSoloMode ? 'B (SOLO FOUNDER)' : 'A (TEAM ORCHESTRATOR)'}
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase">{project.name}</h1>
          <div className="text-gray-600 font-medium max-w-xl text-sm mt-1">
             {project.techStack && <span>💻 {project.techStack}</span>}
          </div>
          <p className="text-gray-800 font-medium max-w-xl mt-2">{project.description}</p>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {/* Only show Invite Link in Mode A */}
          {!isSoloMode && !isMemberView && (
             <NeoButton onClick={copyLink} variant="secondary" className="text-sm py-2">COPY INVITE LINK</NeoButton>
          )}

          {!isMemberView && !project.plan && (
             <NeoButton onClick={handleGeneratePlan} disabled={generating} className="text-sm py-2 min-w-[200px]" variant={isSoloMode ? 'primary' : 'accent'}>
               {generating ? loadingText : isSoloMode ? 'GENERATE TEAM STRUCTURE' : `AUTO-ASSIGN (${project.members.length} Members)`}
             </NeoButton>
          )}

          {/* Export Button for Mode A */}
          {!isSoloMode && project.plan && (
             <NeoButton 
                onClick={() => setExportModalOpen(true)} 
                variant="primary" 
                className="text-sm py-2 flex items-center justify-center gap-2"
             >
               EXPORT TO PM TOOLS <span>↗</span>
             </NeoButton>
          )}

          {/* Only show Simulation in Mode A */}
          {!isSoloMode && !isMemberView && (
             <NeoButton onClick={onJoinAsMember} variant="secondary" className="text-sm py-2 text-gray-500 border-dashed">
               SIMULATE MEMBER JOIN
             </NeoButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Context depends on Mode */}
        <div className="lg:col-span-1 space-y-6">
          {isSoloMode ? (
            /* MODE B LEFT COLUMN */
            <NeoCard title="HIRING PROGRESS" color="bg-[#f0f0f0]">
               {!project.plan ? (
                 <p className="text-gray-500 text-sm">Generate structure to track hiring.</p>
               ) : (
                 <div className="text-center py-4">
                    <div className="text-6xl font-black mb-2">{filledCount}/{totalRoles}</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-gray-500">POSITIONS FILLED</div>
                    
                    <div className="w-full h-4 border-2 border-black mt-4 bg-white relative">
                       <div 
                         className="h-full bg-[#CCFF00] transition-all duration-500"
                         style={{ width: `${progressPercent}%` }}
                       ></div>
                    </div>
                 </div>
               )}
            </NeoCard>
          ) : (
            /* MODE A LEFT COLUMN */
            <NeoCard title="SQUAD" color="bg-[#f0f0f0]">
               {project.members.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 italic mb-2">No members yet.</p>
                    <p className="text-xs font-bold text-gray-400">Invite your team to get started.</p>
                  </div>
               ) : (
                  <ul className="space-y-4">
                    {project.members.map(m => (
                      <li key={m.id} className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                         <div className="font-bold text-lg">{m.name}</div>
                         <div className="text-xs font-mono text-gray-600 break-words">{m.skills}</div>
                      </li>
                    ))}
                  </ul>
               )}
            </NeoCard>
          )}
          
          {project.plan && (
             <NeoCard title="STRATEGIC SUMMARY" color="bg-[#FFFF00]">
                <p className="font-medium text-sm leading-relaxed">
                  {project.plan.summary}
                </p>
             </NeoCard>
          )}
        </div>

        {/* Right Column: Plan / Milestones */}
        <div className="lg:col-span-2">
           {!project.plan ? (
             <div className="h-64 flex flex-col items-center justify-center border-2 border-black border-dashed bg-white/50">
               <p className="text-2xl font-bold text-gray-400 text-center px-4">
                 {isSoloMode 
                   ? "READY TO ARCHITECT YOUR STARTUP" 
                   : "READY TO ASSIGN TASKS"}
               </p>
             </div>
           ) : (
             <div className="space-y-8">
                {/* Roles */}
                <div>
                   <h3 className="text-2xl font-black mb-4 bg-black text-white inline-block px-4 py-1">1. {isSoloMode ? `RECOMMENDED STRUCTURE (${project.plan.roles.length} Roles)` : "ASSIGNMENTS"}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.plan.roles.map((role, i) => (
                        <NeoCard 
                          key={i} 
                          className={`
                            transition-colors flex flex-col h-full 
                            ${role.isFilled && isSoloMode ? 'bg-gray-100 opacity-70' : 'bg-white hover:bg-[#E0F7FA]'}
                          `}
                        >
                           <div className="flex-grow">
                             <div className="flex justify-between items-start">
                               <h4 className="font-bold text-xl mb-1">{role.title}</h4>
                               {isSoloMode && (
                                 <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={role.isFilled || false}
                                      onChange={() => toggleRoleStatus(i)}
                                      className="w-5 h-5 accent-black cursor-pointer"
                                    />
                                    <span className="text-[10px] font-bold uppercase">{role.isFilled ? 'FILLED' : 'VACANT'}</span>
                                 </label>
                               )}
                             </div>
                             <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                             
                             {/* MODE A: Assignment Display */}
                             {!isSoloMode && (
                               <div className="border-t-2 border-black pt-2 flex flex-col gap-2 mb-2">
                                  <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold uppercase text-gray-400">ASSIGNED TO:</span>
                                      <span className={`font-bold px-2 text-sm border border-black ${role.assignedMemberId ? 'bg-[#FF00FF] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                      {role.assignedMemberId ? role.assignedMemberId : 'VACANT'}
                                      </span>
                                  </div>
                                  {role.assignedMemberId && role.assignmentReason && (
                                      <div className="text-xs bg-yellow-50 p-2 border-l-2 border-yellow-400 mt-2">
                                          <strong className="block mb-1">Why this person?</strong> {role.assignmentReason}
                                      </div>
                                  )}
                               </div>
                             )}
                           </div>
                           
                           {/* MODE B: Recruitment Assets & Share Buttons */}
                           {isSoloMode && role.recruitmentBlurb && !role.isFilled && (
                             <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-300">
                               <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">📢 POST TO HIRING PLATFORMS</p>
                               <div className="bg-gray-100 p-2 text-[10px] font-mono text-gray-600 mb-2 max-h-20 overflow-y-auto border border-gray-300">
                                  {role.recruitmentBlurb.substring(0, 100)}...
                               </div>
                               
                               <NeoButton 
                                 onClick={() => openShareModal(role)} 
                                 variant="primary"
                                 className="w-full text-xs py-2 h-10 flex items-center justify-center gap-2"
                               >
                                 POST VACANCY 
                                 <span className="text-lg">↗</span>
                               </NeoButton>
                             </div>
                           )}
                        </NeoCard>
                      ))}
                   </div>
                </div>

                {/* Tasks */}
                <div>
                   <h3 className="text-2xl font-black mb-4 bg-black text-white inline-block px-4 py-1">2. EXECUTION TASKS</h3>
                   <div className="space-y-3">
                      {project.plan.tasks.map((task, i) => (
                        <div key={i} className="flex flex-col bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                  <span className={`w-3 h-3 border border-black ${task.status === 'done' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <span className="font-bold text-lg">{task.title}</span>
                              </div>
                              <span className="text-xs font-bold border border-black px-2 py-1 bg-gray-100 whitespace-nowrap">{task.assignedTo || 'Unassigned'}</span>
                           </div>
                           
                           <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                           
                           {/* MODE A: Task Assignment Reasoning */}
                           {task.assignedTo && task.assignmentReason && (
                              <div className="text-xs bg-blue-50 p-2 border-l-2 border-blue-400 text-blue-800">
                                <span className="font-bold mr-1">AI Reasoning:</span>
                                {task.assignmentReason}
                              </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-2xl font-black mb-4 bg-black text-white inline-block px-4 py-1">3. MILESTONES</h3>
                  <div className="relative border-l-4 border-black ml-4 space-y-6 pl-6 py-2">
                     {project.plan.milestones.map((ms, i) => (
                       <div key={i} className="relative">
                          <div className="absolute -left-[35px] top-1 w-6 h-6 bg-[#CCFF00] border-2 border-black rounded-full"></div>
                          <h4 className="font-bold text-lg">{ms.title}</h4>
                          <p className="text-sm text-gray-600">{ms.description}</p>
                          {ms.dueDate && <span className="text-xs font-bold bg-black text-white px-1 mt-1 inline-block">{ms.dueDate}</span>}
                       </div>
                     ))}
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
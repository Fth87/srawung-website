import React, { useState } from 'react';
import { NeoButton } from './NeoButton';
import { Task, Project } from '../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  project: Project;
}

const INTEGRATIONS = [
  {
    name: 'Notion',
    color: 'bg-white',
    textColor: 'text-black',
    format: 'MARKDOWN',
    url: 'https://www.notion.so/',
    logo: <path d="M4.459 4.208c.746.606 1.026.56 2.67.14.466-.117 3.422-.793 3.422-.793s.186-.047.186.304v11.766c0 .164.117.373.443.467.653.21 2.926 1.143 2.926 1.143s.326.117.326-.35V5.118c0-.257.023-.467.35-.49.326-.024 1.818-.024 1.818-.024s.7.023.7 1.05v12.793s-.046.887-1.002.887c-.093 0-4.054-1.377-5.127-1.89-.933-.444-1.12-1.074-1.12-1.074V6.938L8.79 7.429v9.762s.093.887-.91.887c-.093 0-3.96-1.12-4.94-1.47-.98-.35-1.073-.63-1.073-1.447V5.165c0-1.027.816-1.167 2.592-.957z"/>
  },
  {
    name: 'Trello',
    color: 'bg-[#0079BF]',
    textColor: 'text-white',
    format: 'CSV',
    url: 'https://trello.com/',
    logo: <path d="M19.43 2H4.57C3.15 2 2 3.15 2 4.57V19.43C2 20.85 3.15 22 4.57 22H19.43C20.85 22 22 20.85 22 19.43V4.57C22 3.15 20.85 2 19.43 2ZM10.09 16.35H5.48V5.65H10.09V16.35ZM18.52 11.83H13.91V5.65H18.52V11.83Z"/>
  },
  {
    name: 'Asana',
    color: 'bg-[#F06A6A]',
    textColor: 'text-white',
    format: 'CSV',
    url: 'https://app.asana.com/',
    logo: <path d="M12 11.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4zm5.8-3.4c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2-1-2.2-2.2-2.2zM6.2 6.8C5 6.8 4 7.8 4 9s1 2.2 2.2 2.2 2.2-1 2.2-2.2-1-2.2-2.2-2.2z"/>
  },
  {
    name: 'Jira',
    color: 'bg-[#0052CC]',
    textColor: 'text-white',
    format: 'CSV',
    url: 'https://id.atlassian.com/',
    logo: <path d="M11.53,2C11.64,3.22 12.06,4.39 12.75,5.39L12.75,5.4L12.76,5.41C13.88,7.03 15.61,8.23 17.65,8.7L11.53,14.82L11.53,2ZM11.53,16.23L17.65,10.11C15.61,10.59 13.88,11.78 12.76,13.41L12.75,13.41L12.75,13.42C12.06,14.42 11.64,15.59 11.53,16.82L11.53,16.23ZM2,11.53C3.22,11.64 4.39,12.06 5.39,12.75L5.4,12.75L5.41,12.76C7.03,13.88 8.23,15.61 8.7,17.65L2.59,11.53H2V11.53ZM10.11,2.59L16.23,8.7C15.76,6.66 14.56,4.93 13.44,3.31L13.44,3.3L13.43,3.3C12.43,2.61 11.26,2.19 10.04,2.08L10.11,2.59Z"/>
  },
  {
    name: 'GitHub',
    color: 'bg-[#24292e]',
    textColor: 'text-white',
    format: 'MARKDOWN',
    url: 'https://github.com/',
    logo: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  },
  {
    name: 'Slack',
    color: 'bg-[#4A154B]',
    textColor: 'text-white',
    format: 'TEXT',
    url: 'https://slack.com/',
    logo: <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.52v-6.315zM8.834 5.042a2.528 2.528 0 0 1 2.521-2.521A2.528 2.528 0 0 1 13.877 5.042v2.52h-2.522a2.528 2.528 0 0 1-2.521-2.52zm2.521 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521h-6.313A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.521-2.521h6.313zM18.916 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 23.96 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522v-2.521zm-1.271 2.521a2.528 2.528 0 0 1-2.52-2.521 2.528 2.528 0 0 1 2.52-2.521h6.313A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-6.313zM15.165 18.916a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 15.165 13.877v-2.522h2.52a2.528 2.528 0 0 1 2.522 2.521zm-1.27 1.271a2.528 2.528 0 0 1-2.521-2.522 2.528 2.528 0 0 1 2.521-2.521h6.313a2.528 2.528 0 0 1 2.52 2.521 2.527 2.527 0 0 1-2.52 2.522h-6.313z"/>
  }
];

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, tasks, project }) => {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateContent = (platform: typeof INTEGRATIONS[0]) => {
    if (platform.format === 'MARKDOWN') {
      return `# ${project.name} - Task List\n\n` + tasks.map(t => (
        `- [ ] **${t.title}** (@${t.assignedTo})\n  ${t.description}`
      )).join('\n');
    } 
    
    if (platform.format === 'CSV') {
      const header = `Title,Description,Assignee,Status\n`;
      const rows = tasks.map(t => (
        `"${t.title}","${t.description}","${t.assignedTo}","${t.status}"`
      )).join('\n');
      return header + rows;
    }

    if (platform.format === 'TEXT') {
      return `*${project.name} Tasks*\n\n` + tasks.map(t => (
        `• *${t.title}* -> ${t.assignedTo}\n> ${t.description}`
      )).join('\n\n');
    }

    return '';
  };

  const handleIntegrationClick = (platform: typeof INTEGRATIONS[0]) => {
    setActivePlatform(platform.name);
    const content = generateContent(platform);
    navigator.clipboard.writeText(content);
    setCopied(true);
    
    // Tiny delay to let user see "Copied" before redirect
    setTimeout(() => {
        window.open(platform.url, '_blank');
        setCopied(false);
    }, 1000);
  };

  const previewContent = activePlatform 
    ? generateContent(INTEGRATIONS.find(i => i.name === activePlatform)!) 
    : generateContent(INTEGRATIONS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
           <h3 className="text-2xl font-black uppercase">EXPORT TO PM TOOLS</h3>
           <button onClick={onClose} className="text-white hover:text-[#CCFF00] font-bold text-xl">✕</button>
        </div>

        <div className="p-6">
          <p className="font-bold text-gray-600 mb-6">
            Srawung currently supports "Smart Copy". Select a tool to copy the formatted tasks to your clipboard, then Paste/Import them into your workspace.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {INTEGRATIONS.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleIntegrationClick(platform)}
                className={`
                  ${platform.color} ${platform.textColor}
                  border-2 border-black p-4 flex flex-col items-center justify-center gap-3
                  hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all
                  group relative
                `}
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">{platform.logo}</svg>
                <span className="font-bold uppercase tracking-tight">{platform.name}</span>
                {copied && activePlatform === platform.name && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-[#CCFF00] font-bold text-xs uppercase animate-pulse">
                        COPIED!
                    </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="mb-6 bg-gray-100 p-4 border-2 border-black border-dashed">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">RAW DATA PREVIEW (MARKDOWN/CSV)</h4>
            <p className="text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto overflow-x-hidden break-all">
                {previewContent.substring(0, 500)}...
            </p>
          </div>

          <div className="flex justify-end">
             <NeoButton onClick={onClose} variant="secondary">
               CLOSE
             </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
};

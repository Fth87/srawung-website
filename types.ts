export type SubscriptionTier = 'STARTER' | 'PRO' | 'STUDIO';

export type ProjectMode = 'TEAM' | 'SOLO';

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier?: SubscriptionTier;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  mode: ProjectMode; // New: Determines the workflow
  deadline?: string; 
  techStack?: string; 
  questions: AssessmentQuestion[];
  members: TeamMember[];
  plan?: ProjectPlan;
  createdAt: number;
}

export interface TeamMember {
  id: string;
  name: string;
  skills: string;
  answers: { question: string; answer: string }[];
  matchScore?: number; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; 
  assignmentReason?: string; 
  status: 'todo' | 'in-progress' | 'done';
}

export interface Role {
  title: string;
  description: string;
  recruitmentBlurb?: string; 
  assignedMemberId?: string;
  assignmentReason?: string;
  isFilled?: boolean; // New: For Solo mode checkbox
}

export interface Milestone {
  title: string;
  description: string;
  dueDate?: string;
}

export interface ProjectPlan {
  roles: Role[];
  tasks: Task[];
  milestones: Milestone[];
  summary: string;
}

export enum ViewState {
  LANDING,
  LOGIN,
  REGISTER,
  DASHBOARD,
  CREATE_PROJECT,
  PROJECT_DETAILS,
  MEMBER_JOIN,
  DOCS,
  ABOUT,
  PRICING,
}
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './screens/Landing';
import { Dashboard } from './screens/Dashboard';
import { ProjectSetup } from './screens/ProjectSetup';
import { MemberAssessment } from './screens/MemberAssessment';
import { ProjectResults } from './screens/ProjectResults';
import { Docs } from './screens/Docs';
import { About } from './screens/About';
import { Pricing } from './screens/Pricing';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { Project, TeamMember, ViewState, User } from './types';

// Mock Data for initial load
const MOCK_PROJECTS: Project[] = [];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Simple Router replacement
  const navigateTo = (v: ViewState) => setView(v);

  const handleLogin = (u: User) => {
    setUser(u);
    navigateTo(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo(ViewState.LANDING);
  };

  const handleCreateProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
    setCurrentProject(project);
    navigateTo(ViewState.PROJECT_DETAILS);
  };

  const handleSelectProject = (id: string) => {
    const p = projects.find(proj => proj.id === id);
    if (p) {
      setCurrentProject(p);
      navigateTo(ViewState.PROJECT_DETAILS);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setCurrentProject(updated);
  };

  const handleMemberJoin = (member: TeamMember) => {
    if (currentProject) {
      const updated = {
        ...currentProject,
        members: [...currentProject.members, member]
      };
      handleUpdateProject(updated);
      navigateTo(ViewState.PROJECT_DETAILS);
    }
  };

  const handleSimulationJoin = () => {
     if (currentProject) {
        navigateTo(ViewState.MEMBER_JOIN);
     }
  };

  // Render view based on state
  const renderContent = () => {
    switch (view) {
      case ViewState.LANDING:
        // Pass a wrapper to onStart to check auth
        return <Landing onStart={() => navigateTo(ViewState.PRICING)} />;
      
      case ViewState.PRICING:
        return <Pricing onBack={() => navigateTo(ViewState.LANDING)} onSelectTier={(tier) => user ? navigateTo(ViewState.DASHBOARD) : navigateTo(ViewState.REGISTER)} />;

      case ViewState.LOGIN:
        return <Login onLogin={handleLogin} onRegisterClick={() => navigateTo(ViewState.REGISTER)} />;

      case ViewState.REGISTER:
        return <Register onRegister={handleLogin} onLoginClick={() => navigateTo(ViewState.LOGIN)} />;

      case ViewState.DASHBOARD:
        if (!user) return <Login onLogin={handleLogin} onRegisterClick={() => navigateTo(ViewState.REGISTER)} />;
        return (
          <Dashboard 
            projects={projects} 
            onCreateNew={() => navigateTo(ViewState.CREATE_PROJECT)}
            onSelectProject={handleSelectProject}
          />
        );
      
      case ViewState.CREATE_PROJECT:
        if (!user) return <Login onLogin={handleLogin} onRegisterClick={() => navigateTo(ViewState.REGISTER)} />;
        return (
          <ProjectSetup 
            onProjectCreated={handleCreateProject}
            onCancel={() => navigateTo(ViewState.DASHBOARD)}
          />
        );
      
      case ViewState.PROJECT_DETAILS:
        if (!user) return <Login onLogin={handleLogin} onRegisterClick={() => navigateTo(ViewState.REGISTER)} />;
        return currentProject ? (
          <ProjectResults 
            project={currentProject} 
            onUpdateProject={handleUpdateProject}
            onBack={() => navigateTo(ViewState.DASHBOARD)}
            onJoinAsMember={handleSimulationJoin}
          />
        ) : null;

      case ViewState.MEMBER_JOIN:
        // Member join might be public (no auth required for invitees)
        return currentProject ? (
          <MemberAssessment 
            project={currentProject}
            onSubmit={handleMemberJoin}
            onCancel={() => navigateTo(ViewState.PROJECT_DETAILS)}
          />
        ) : null;

      case ViewState.DOCS:
        return <Docs onBack={() => navigateTo(ViewState.LANDING)} />;

      case ViewState.ABOUT:
        return <About onBack={() => navigateTo(ViewState.LANDING)} />;

      default:
        return <Landing onStart={() => navigateTo(ViewState.PRICING)} />;
    }
  };

  return (
    <Layout onNavigate={navigateTo} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
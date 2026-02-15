import React from 'react';
import { ViewState, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: ViewState) => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto border-x-2 border-black bg-[#fdfbf7]">
      <header className="border-b-2 border-black p-6 bg-white flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4 md:gap-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(ViewState.LANDING)}>
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold text-xl">S</div>
          <h1 className="text-3xl font-bold tracking-tighter">SRAWUNG<span className="text-gray-400">.AI</span></h1>
        </div>
        
        <nav className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate(ViewState.DOCS)} 
            className="font-bold underline decoration-2 underline-offset-4 hover:bg-black hover:text-white px-2 transition-colors uppercase hidden md:block"
          >
            Docs
          </button>
          <button 
            onClick={() => onNavigate(ViewState.ABOUT)} 
            className="font-bold underline decoration-2 underline-offset-4 hover:bg-black hover:text-white px-2 transition-colors uppercase hidden md:block"
          >
            About
          </button>
          
          <div className="h-6 w-[2px] bg-gray-300 hidden md:block mx-2"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 {user.avatar && <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-black bg-yellow-200" />}
                 <span className="font-bold hidden sm:block">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="font-bold bg-black text-white px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors text-sm"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
               <button 
                onClick={() => onNavigate(ViewState.LOGIN)}
                className="font-bold px-4 py-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
               >
                 LOGIN
               </button>
               <button 
                onClick={() => onNavigate(ViewState.REGISTER)}
                className="font-bold bg-[#CCFF00] px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all"
               >
                 JOIN
               </button>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-grow p-4 md:p-8">
        {children}
      </main>
      <footer className="border-t-2 border-black p-6 bg-black text-white mt-auto">
        <div className="flex justify-between items-center">
          <p className="font-bold">© 2025 SRAWUNG.</p>
          <div className="flex gap-4">
             <span className="text-gray-400 text-sm">GATHER. BUILD. SHIP.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
import React, { useState } from 'react';
import { NeoCard } from '../components/NeoCard';
import { NeoInput } from '../components/NeoInput';
import { NeoButton } from '../components/NeoButton';
import { GoogleIcon } from '../components/GoogleIcon';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
  onLoginClick: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      onRegister({
        id: 'new-user-' + Math.random(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`
      });
    }, 1000);
  };

  const handleGoogleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      onRegister({
        id: 'google-user-new',
        name: 'New Google User',
        email: 'new@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=GoogleNew'
      });
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <NeoCard className="bg-[#FFFF00]">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black uppercase mb-2">JOIN SRAWUNG</h2>
            <p className="font-medium">Build teams fast. Ship faster.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <NeoInput 
              label="Full Name" 
              type="text" 
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <NeoInput 
              label="Email" 
              type="email" 
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NeoInput 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <NeoButton type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-gray-800">
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </NeoButton>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[2px] bg-black flex-1"></div>
            <span className="font-bold text-sm">OR</span>
            <div className="h-[2px] bg-black flex-1"></div>
          </div>

          <button 
             onClick={handleGoogleRegister}
             disabled={loading}
             className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black p-3 font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-50"
          >
            <GoogleIcon className="w-6 h-6" />
            <span>SIGN UP WITH GOOGLE</span>
          </button>

          <div className="mt-8 text-center">
            <p className="font-bold">
              Already have an account? <button onClick={onLoginClick} className="underline text-blue-800 hover:text-black">Log in</button>
            </p>
          </div>
        </NeoCard>
      </div>
    </div>
  );
};
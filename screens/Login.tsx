import React, { useState } from 'react';
import { NeoCard } from '../components/NeoCard';
import { NeoInput } from '../components/NeoInput';
import { NeoButton } from '../components/NeoButton';
import { GoogleIcon } from '../components/GoogleIcon';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      onLogin({
        id: 'user-123',
        name: email.split('@')[0],
        email: email,
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'
      });
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate OAuth
    setTimeout(() => {
      onLogin({
        id: 'google-user-456',
        name: 'Srawung Google User',
        email: 'user@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Google'
      });
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <NeoCard className="bg-white">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black uppercase mb-2">Login</h2>
            <p className="font-medium text-gray-500">Welcome back to the chaos.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <NeoInput 
              label="Email" 
              type="email" 
              placeholder="you@domain.com"
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
            
            <NeoButton type="submit" disabled={loading} className="w-full">
              {loading ? "AUTHENTICATING..." : "ENTER APP"}
            </NeoButton>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[2px] bg-black flex-1"></div>
            <span className="font-bold text-sm">OR</span>
            <div className="h-[2px] bg-black flex-1"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black p-3 font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-50"
          >
            <GoogleIcon className="w-6 h-6" />
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          <div className="mt-8 text-center">
            <p className="font-bold">
              New here? <button onClick={onRegisterClick} className="underline text-blue-600 hover:text-black">Create an account</button>
            </p>
          </div>
        </NeoCard>
      </div>
    </div>
  );
};
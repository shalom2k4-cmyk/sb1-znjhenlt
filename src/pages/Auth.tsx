import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { setActiveTab } = useApp(); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('home'); 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 pt-20">
      <div className="mb-12 text-center">
        {/* Container that perfectly holds the white background logo design */}
        <div className="w-32 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-2 shadow-sm border border-slate-100">
          <img 
            src="/Logo.png" 
            alt="Mperekeza Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-black text-slate-800">
          {isLogin ? 'Ikaze kuri Mperekeza' : 'Fungura Konti'}
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          {isLogin ? 'Injira ukomeze gukurikirana ubuzima' : 'Yunguka ubumenyi ku buzima bwawe'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Amazina yose"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-teal-500 transition-all"
              required
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="email" 
            placeholder="Email"
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-teal-500 transition-all"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="password" 
            placeholder="Ijambo ry'ibanga"
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-teal-500 transition-all"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 flex items-center justify-center gap-2 mt-4 transition-all active:scale-95"
        >
          {isLogin ? 'Injira' : 'Kwiyandikisha'}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-auto pb-12 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors"
        >
          {isLogin ? "Ntabwo ufite konti? Iyandikishe" : "Ufite konti? Injira hano"}
        </button>
      </div>
    </div>
  );
}
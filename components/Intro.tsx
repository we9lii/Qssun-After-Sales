import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import { useAppContext } from '../App';

interface IntroProps {
  onComplete: () => void;
  userName?: string;
}

const Intro: React.FC<IntroProps> = ({ onComplete, userName }) => {
  const { t } = useAppContext();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Timings adapted for a smoother, professional app-like transition
    const t1 = setTimeout(() => setStep(1), 100); // Start background
    const t2 = setTimeout(() => setStep(2), 500); // Content fade in
    const t3 = setTimeout(() => setStep(3), 3000); // Exit trigger
    const t4 = setTimeout(() => onComplete(), 3500); // Unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 bg-gray-50 dark:bg-[#020617] font-sans ${step === 3 ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      
      {/* 1. Consistent Background (Matches Login & App) */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-volt-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* 2. Central Glass Card */}
      <div className={`relative z-10 w-full max-w-sm mx-auto p-12 rounded-[2.5rem] flex flex-col items-center transition-all duration-1000 transform ${step >= 2 ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-12 opacity-0 blur-sm'}`}>
        
        {/* Icon / Avatar Wrapper */}
        <div className="relative w-28 h-28 mb-8">
           {/* Pulsing ring */}
           <div className="absolute inset-0 bg-volt-500/20 rounded-full animate-ping opacity-20 duration-1000"></div>
           <div className="absolute inset-0 bg-white/50 dark:bg-white/5 rounded-full blur-xl"></div>
           
           <div className="relative w-full h-full bg-white dark:bg-[#1e293b] rounded-full shadow-2xl shadow-volt-500/10 flex items-center justify-center border border-white/50 dark:border-white/10 p-1">
              {userName ? (
                 <div className="w-full h-full rounded-full bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center">
                    <UserCheck size={48} className="text-volt-600 dark:text-volt-400" strokeWidth={1.5} />
                 </div>
              ) : (
                 <img 
                    src="https://www2.0zz0.com/2025/12/16/13/625684600.png" 
                    alt="Logo" 
                    className="w-16 h-16 object-contain" 
                 />
              )}
           </div>
           
           {/* Verified Badge */}
           {userName && (
             <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-4 border-gray-50 dark:border-[#020617] animate-in zoom-in duration-500 delay-300">
               <CheckCircle2 size={16} strokeWidth={3} />
             </div>
           )}
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              {userName ? t.welcomeBack : 'System Initializing'}
           </p>
           
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
             {userName || (
               <>Qssun <span className="text-volt-600">App</span></>
             )}
           </h1>

           {/* Dynamic Status Pill */}
           {userName ? (
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-volt-50 dark:bg-volt-900/20 border border-volt-100 dark:border-volt-500/20 mt-2 animate-pulse">
                <Sparkles size={12} className="text-volt-600 dark:text-volt-400" />
                <span className="text-[10px] font-bold text-volt-700 dark:text-volt-300 uppercase tracking-wider">
                   Syncing Data...
                </span>
             </div>
           ) : (
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Preparing workspace environment</p>
           )}
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-32 h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-12 overflow-hidden relative">
           <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-volt-500 to-volt-400 transition-all ease-out duration-[2000ms] rounded-full ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
        </div>

      </div>

    </div>
  );
};

export default Intro;
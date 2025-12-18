import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole, Report, MOCK_USERS } from './types';
import TechnicianForm from './components/TechnicianForm';
import ReportView from './components/ReportView';
import Intro from './components/Intro';
import { translations, Language } from './locales';
import {
  LogOut, FileText, Search, UserCircle,
  Moon, Sun, Globe, Zap, ChevronRight, ChevronLeft, Plus,
  ShieldCheck, Smartphone, CheckCircle, Clock, CheckCircle2,
  Lock, KeyRound, Sparkles, LayoutGrid, ArrowRight, Activity, BarChart3,
  Settings, UserPlus, RefreshCw, Copy, X, Users, Briefcase, Loader2, Trash2
} from 'lucide-react';

// --- Contexts ---
interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: typeof translations['en'];
  dir: 'rtl' | 'ltr';
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);

const apiUrl = 'https://qssun-after-sales.onrender.com/api';

// --- Login Screen Component ---
const LoginScreen = ({ onLogin, usersList }: { onLogin: (user: User) => void, usersList: User[] }) => {
  const { t, theme, toggleTheme, lang, setLang } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    setTimeout(() => {
      const foundUser = usersList.find(
        u => u.username?.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-volt-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex gap-2 z-20">
        <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all backdrop-blur-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10 shadow-sm">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 transition-all backdrop-blur-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10 shadow-sm">
          {lang === 'ar' ? 'EN' : 'ع'}
        </button>
      </div>

      <div className="w-full max-w-[400px] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/5 p-8 md:p-10 relative z-10 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">

        <div className="w-28 h-28 mb-6 relative hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-volt-500/20 blur-2xl rounded-full opacity-50 animate-pulse-slow"></div>
          <img
            src="https://www2.0zz0.com/2025/12/16/13/625684600.png"
            alt="Qssun"
            className="w-full h-full object-contain relative z-10 drop-shadow-xl"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          Qssun <span className="text-volt-600 dark:text-volt-400">After Sales</span>
        </h1>

        <div className="flex items-center gap-3 mb-8 mt-4">
          <div className="h-px w-12 bg-gray-200 dark:bg-white/10"></div>
          <p className="text-sm md:text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {t.welcomeBack}
          </p>
          <div className="h-px w-12 bg-gray-200 dark:bg-white/10"></div>
        </div>

        <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
          <div className="space-y-1.5 text-start">
            <div className="relative group">
              <div className="absolute top-1/2 left-4 rtl:left-auto rtl:right-4 -translate-y-1/2 text-gray-400 group-focus-within:text-volt-500 transition-colors">
                <UserCircle size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 rtl:pr-12 rtl:pl-4 outline-none focus:border-volt-500 focus:ring-4 focus:ring-volt-500/10 transition-all font-bold text-sm text-gray-900 dark:text-white placeholder-gray-400"
                placeholder={t.username}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <div className="relative group">
              <div className="absolute top-1/2 left-4 rtl:left-auto rtl:right-4 -translate-y-1/2 text-gray-400 group-focus-within:text-volt-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 rtl:pr-12 rtl:pl-4 outline-none focus:border-volt-500 focus:ring-4 focus:ring-volt-500/10 transition-all font-bold text-sm text-gray-900 dark:text-white placeholder-gray-400 font-mono tracking-widest"
                placeholder="••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-center py-1 animate-in fade-in slide-in-from-top-1">
              <span className="text-red-500 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> {t.loginError}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 hover:from-volt-600 hover:to-volt-500 dark:hover:from-volt-400 dark:hover:to-volt-300 text-white dark:text-gray-900 py-4 rounded-2xl font-bold shadow-lg shadow-gray-200/50 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="tracking-wide">{t.loginButton}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 w-full text-center space-y-2">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
            {t.companyName}
          </p>
          <p className="text-[8px] font-mono font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            {t.devCredit}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- User Management Modal ---
interface UserManagementModalProps {
  onClose: () => void;
  onCreate: (u: User) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  users: User[];
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ onClose, onCreate, onDelete, users }) => {
  const { t, dir } = useAppContext();
  const [view, setView] = useState<'MENU' | 'CREATE' | 'LIST'>('MENU');

  const [name, setName] = useState('');

  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const generatePassword = () => {
    const digits = '0123456789';
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let pass = '';
    for (let i = 0; i < 6; i++) {
      pass += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    for (let i = 0; i < 2; i++) {
      pass += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    setPassword(pass);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const newUser: User = {
      id: `tech_${Date.now()}`,
      name,
      role: UserRole.TECHNICIAN,
      phone,
      username,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    try {
      await onCreate(newUser);
      setCreatedUser(newUser);
    } catch (err) {
      alert('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const shareMessage = () => {
    if (!createdUser) return;
    const msg = `${t.username}: ${createdUser.username}\n${t.password}: ${createdUser.password}\n${t.appLink}: ${window.location.origin}`;

    // Attempt modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg)
        .then(() => alert(t.copied || 'Copied!'))
        .catch(err => console.error('Copy failed', err));
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = msg;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert(t.copied || 'Copied!');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Content for MENU view
  const renderMenu = () => (
    <div className="p-8 grid gap-4">
      <h3 className="text-center text-lg font-bold text-gray-500 mb-4 uppercase tracking-widest">{t.selectOption}</h3>
      <button
        onClick={() => setView('CREATE')}
        className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl hover:bg-volt-50 dark:hover:bg-volt-900/10 border border-transparent hover:border-volt-200 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-volt-100 dark:bg-volt-900/40 flex items-center justify-center text-volt-600 dark:text-volt-400 group-hover:scale-110 transition-transform">
          <UserPlus size={24} />
        </div>
        <div className="text-start">
          <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-volt-700 dark:group-hover:text-volt-300">{t.createUser}</h4>
          <p className="text-xs text-gray-500">Add new technicians to the system</p>
        </div>
        <div className="flex-1"></div>
        <ChevronLeft className={`text-gray-300 group-hover:text-volt-500 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
      </button >

      <button
        onClick={() => setView('LIST')}
        className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl hover:bg-volt-50 dark:hover:bg-volt-900/10 border border-transparent hover:border-volt-200 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
          <Users size={24} />
        </div>
        <div className="text-start">
          <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">{t.usersList}</h4>
          <p className="text-xs text-gray-500">View and manage existing accounts</p>
        </div>
        <div className="flex-1"></div>
        <ChevronLeft className={`text-gray-300 group-hover:text-indigo-500 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
      </button >
    </div >
  );

  // Content for CREATE view
  const renderCreate = () => (
    !createdUser ? (
      <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <button type="button" onClick={() => setView('MENU')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowRight size={20} className={dir === 'ltr' ? 'rotate-180' : ''} />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.createUser}</span>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t.employeeName}</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-volt-500 font-bold dark:text-white" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t.employeePhone}</label>
          <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-volt-500 font-bold dark:text-white font-mono" dir="ltr" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t.username}</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-volt-500 font-bold dark:text-white" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t.password}</label>
            <div className="relative">
              <input type="text" required value={password} readOnly className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none font-bold dark:text-white font-mono text-center tracking-widest text-lg" />
            </div>
          </div>
        </div>

        <button type="button" onClick={generatePassword} className="w-full py-3 border-2 border-dashed border-volt-300 dark:border-volt-700 rounded-xl text-volt-600 dark:text-volt-400 font-bold hover:bg-volt-50 dark:hover:bg-volt-900/20 transition flex items-center justify-center gap-2">
          <RefreshCw size={18} /> {t.generatePass}
        </button>

        <button type="submit" disabled={!name || !phone || !username || !password || isCreating} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center">
          {isCreating ? <Loader2 className="animate-spin" /> : t.createUser}
        </button>
      </form>
    ) : (
      <div className="p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.userCreated}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Credentials ready.</p>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-start space-y-3 font-mono text-sm relative">
          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
            <span className="text-gray-500">User:</span>
            <span className="font-bold dark:text-white">{createdUser.username}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
            <span className="text-gray-500">Pass:</span>
            <span className="font-bold dark:text-white text-volt-600">{createdUser.password}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setCreatedUser(null); setView('MENU'); }} className="flex-1 py-3 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">{t.back}</button>
          <button onClick={shareMessage} className="flex-[2] py-3 bg-volt-600 text-white rounded-xl font-bold shadow-lg shadow-volt-500/20 hover:bg-volt-700 flex items-center justify-center gap-2">
            <Copy size={18} /> {t.copyShare}
          </button>
        </div>
      </div>
    )
  );

  // Content for LIST view (Same as before)
  // Content for LIST view (Same as before)
  const renderList = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
        <button type="button" onClick={() => setView('MENU')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
          <ArrowRight size={20} className={dir === 'ltr' ? 'rotate-180' : ''} />
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.usersList}</span>
      </div>
      <div className="overflow-y-auto max-h-[400px] p-4 space-y-3">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold overflow-hidden">
              {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{u.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-gray-500 bg-white dark:bg-black/20 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">{u.username}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${u.role === UserRole.MANAGER ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-500 bg-gray-200 dark:bg-gray-800'}`}>
                  {u.role === UserRole.MANAGER ? t.roleManager : t.roleTechnician}
                </span>
              </div>
            </div>
            {u.phone && (
              <a href={`tel:${u.phone}`} className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                <Smartphone size={16} />
              </a>
            )}
            {u.role !== UserRole.MANAGER && (
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) onDelete(u.id);
                }}
                className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-volt-600 p-6 text-white relative shrink-0">
          <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition z-10"><X size={18} /></button>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Settings size={20} />
            </div>
            <h2 className="text-xl font-bold">{t.manageUsers}</h2>
          </div>
        </div >
        <div className="flex-1 overflow-auto">
          {view === 'MENU' && renderMenu()}
          {view === 'CREATE' && renderCreate()}
          {view === 'LIST' && renderList()}
        </div>
      </div >
    </div >
  );
};


// --- Main App Content ---
const AppContent: React.FC = () => {
  const { t, lang, setLang, theme, toggleTheme, dir } = useAppContext();

  // States
  const [users, setUsers] = useState<User[]>([]); // Empty initial state, will fetch
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginIntro, setShowLoginIntro] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);

  const [reports, setReports] = useState<Report[]>([]);
  const [view, setView] = useState<'DASHBOARD' | 'NEW_FORM'>('DASHBOARD');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showUserManagement, setShowUserManagement] = useState(false);

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitial(true);
        // Fetch Users
        try {
          const usersRes = await fetch(`${apiUrl}/users`);
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData);
          } else {
            throw new Error('API Error');
          }
        } catch (e) {
          console.warn("Backend unavailable, using mock data");
          setUsers(MOCK_USERS);
        }

        // Fetch Reports
        try {
          const reportsRes = await fetch(`${apiUrl}/reports`);
          if (reportsRes.ok) {
            const reportsData = await reportsRes.json();
            setReports(reportsData);
          }
        } catch (e) {
          console.warn("Backend unavailable for reports");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchData();
  }, []);

  const handleLogin = (user: User) => {
    setTempUser(user);
    setShowLoginIntro(true);
  };

  const handleIntroComplete = () => {
    setCurrentUser(tempUser);
    setShowLoginIntro(false);
    setTempUser(null);
  };

  const handleCreateUser = async (newUser: User) => {
    // API Call
    const res = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      const savedUser = await res.json();
      setUsers(prev => [...prev, savedUser]);
    } else {
      throw new Error('Failed to create user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting user');
    }
  };

  const saveReport = (newReport: Report) => {
    // The actual API call is inside TechnicianForm, this just updates UI state
    setReports(prev => [newReport, ...prev]);
    setView('DASHBOARD');
  };

  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = r.customerName.toLowerCase().includes(term) || r.technicianName.toLowerCase().includes(term);
    if (currentUser?.role === UserRole.TECHNICIAN) {
      return matchesSearch && r.technicianId === currentUser.id;
    }
    return matchesSearch;
  });

  // Loading Screen
  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="animate-spin text-volt-600" size={48} />
      </div>
    );
  }

  // Render Logic

  if (showLoginIntro) {
    return <Intro onComplete={handleIntroComplete} userName={tempUser?.name} />;
  }

  if (!currentUser) return <LoginScreen onLogin={handleLogin} usersList={users} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c0e] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 relative flex flex-col">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      {/* Navbar */}
      <div className="sticky top-4 z-40 max-w-7xl mx-auto w-full px-4">
        <div className="bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-none p-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('DASHBOARD')}>
            <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center p-1 border border-gray-100 dark:border-white/10 shadow-sm">
              <img src="https://www2.0zz0.com/2025/12/16/13/625684600.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-gray-900 dark:text-white leading-tight">Qssun</h1>
              <p className="text-[10px] font-bold text-volt-600 uppercase tracking-wider">After Sales</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === UserRole.MANAGER && (
              <button
                onClick={() => setShowUserManagement(true)}
                className="w-10 h-10 rounded-full bg-volt-50 dark:bg-volt-900/20 text-volt-600 dark:text-volt-400 flex items-center justify-center hover:bg-volt-100 dark:hover:bg-volt-900/40 transition mr-1"
                title={t.manageUsers}
              >
                <Settings size={20} />
              </button>
            )}

            <div className="flex items-center gap-1 md:gap-2 bg-gray-100 dark:bg-white/5 rounded-full p-1 border border-gray-200 dark:border-white/5 mr-1 md:mr-2">
              <button onClick={toggleTheme} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm dark:hover:bg-white/10 transition-all">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-white hover:shadow-sm dark:hover:bg-white/10 transition-all">
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
            </div>
            <button onClick={() => { setCurrentUser(null); setView('DASHBOARD'); }} className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-3 md:px-4 py-2 rounded-xl transition text-sm font-bold">
              <LogOut size={18} />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </div >

      <main className="max-w-7xl mx-auto px-4 w-full relative z-10 pt-6 pb-24">
        {view === 'NEW_FORM' ? (
          <TechnicianForm
            user={currentUser}
            onSave={saveReport}
            onCancel={() => setView('DASHBOARD')}
          />
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="relative rounded-[2rem] overflow-hidden bg-[#020617] text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-volt-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-volt-300 uppercase tracking-wider mb-4">
                    <Activity size={12} className="text-green-400" /> System Active
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                    {t.dashboard}
                  </h2>
                  <p className="text-gray-400 max-w-lg">
                    Welcome back, <span className="text-white font-bold">{currentUser.name}</span>. You have <span className="text-white font-bold">{filteredReports.length}</span> reports in history.
                  </p>
                </div>

                {currentUser.role === UserRole.TECHNICIAN && (
                  <button
                    onClick={() => setView('NEW_FORM')}
                    className="group bg-white text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all hover:-translate-y-1 active:translate-y-0 min-w-[200px] justify-center"
                  >
                    <Plus size={20} strokeWidth={3} className="text-volt-600" />
                    {t.newReport}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-[#18181b] p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5">
              <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-300 dark:text-gray-600">
                  <FileText size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.noReports}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t.noReportsDesc}</p>
              </div >
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report, index) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="group bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-volt-500/10 hover:border-volt-200 dark:hover:border-volt-900 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 group-hover:from-volt-500 group-hover:to-indigo-500 transition-all duration-500"></div>

                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-900 dark:text-white font-bold text-xl border border-gray-100 dark:border-white/5 group-hover:bg-volt-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                          {report.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">ID</span>
                          <span className="font-mono text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                            #{report.id.slice(0, 4)}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-xl text-gray-900 dark:text-white truncate mb-2 group-hover:text-volt-600 dark:group-hover:text-volt-400 transition-colors">
                        {report.customerName}
                      </h4>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs font-bold flex items-center gap-1.5">
                          <BarChart3 size={12} /> {report.maintenanceType}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-volt-50 dark:bg-volt-900/20 text-volt-700 dark:text-volt-300 text-xs font-bold flex items-center gap-1.5">
                          <Zap size={12} className="fill-current" /> {report.projectSize} HP
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-white/5 pt-4 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <UserCircle size={16} />
                        {report.technicianName.split(' ')[0]}
                      </div>
                      <div className="text-xs font-mono text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                  </div >
                ))}
              </div >
            )}
          </div >
        )}
      </main >

      {view === 'DASHBOARD' && currentUser?.role === UserRole.TECHNICIAN && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <button
            onClick={() => setView('NEW_FORM')}
            className="w-full bg-[#020617] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all border border-white/20"
          >
            <Plus size={24} />
            <span className="font-bold text-lg">{t.newReport}</span>
          </button>
        </div>
      )}

      <footer className="py-6 text-center border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c0c0e] mt-auto space-y-1">
        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
          {t.companyName}
        </p>
        <p className="text-[8px] font-mono font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          {t.devCredit}
        </p>
      </footer>

      {showUserManagement && (
        <UserManagementModal
          onClose={() => setShowUserManagement(false)}
          onCreate={handleCreateUser}
          onDelete={handleDeleteUser}
          users={users}
        />
      )
      }

      {
        selectedReport && (
          <ReportView report={selectedReport} onClose={() => setSelectedReport(null)} />
        )
      }
    </div >
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ lang, setLang, theme, toggleTheme, t: translations[lang], dir: 'rtl' }}>
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <AppContent />
      )}
    </AppContext.Provider>
  );
};

export default App;
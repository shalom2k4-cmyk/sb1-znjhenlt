import { Home, BookOpen, Calendar, Stethoscope, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'home', label: 'Ahabanza', icon: Home },
  { id: 'insights', label: 'Ubumenyi', icon: BookOpen },
  { id: 'tracker', label: 'Kalendari', icon: Calendar },
  { id: 'consultation', label: 'Muganga', icon: Stethoscope },
  { id: 'settings', label: 'Igenamiterere', icon: Settings },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDFCF8] border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-sky-blue'
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-sky-blue/10' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-blue" />
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide truncate ${isActive ? 'text-sky-blue' : 'text-text-muted'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

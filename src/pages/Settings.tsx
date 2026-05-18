import { Eye, EyeOff, Bell, Shield, Globe, ChevronRight, Heart, Lock, Info, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-teal-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  sublabel,
  iconColor,
  iconBg,
  toggle,
  checked,
  onToggle,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  iconColor: string;
  iconBg: string;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick ?? onToggle}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
      {toggle ? (
        <Toggle checked={!!checked} onChange={onToggle ?? (() => {})} />
      ) : (
        <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
      )}
    </button>
  );
}

export default function Settings() {
  const { 
    isAnonymous, 
    toggleAnonymous, 
    todayCycleDay, 
    isAdvancedMode, 
    setIsAdvancedMode, 
    customLength, 
    setCustomLength,
    effectiveLength 
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 pt-safe">
        <div className="max-w-md mx-auto px-4 pt-12 pb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Igenamiterere</h1>
          <p className="text-slate-300 text-sm">Hindura ibyo ushaka ku makuru yawe</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        
        {/* ADVANCED MODE CARD */}
        <div className={`rounded-2xl p-4 shadow-sm border transition-all duration-300 ${isAdvancedMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdvancedMode ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-100 text-slate-500'}`}>
                <Sliders size={18} />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isAdvancedMode ? 'text-white' : 'text-slate-800'}`}>Ihitamo Ryisumbuye</h3>
                <p className="text-[10px] text-slate-500">Advanced Mode (Cycle Logic)</p>
              </div>
            </div>
            <Toggle checked={isAdvancedMode} onChange={() => setIsAdvancedMode(!isAdvancedMode)} />
          </div>
          
          {isAdvancedMode && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Iminsi y'ukwezi</span>
                <span className="text-sm font-black text-white bg-teal-500/20 px-2 py-0.5 rounded-md">{customLength}</span>
              </div>
              <input 
                type="range" min="21" max="35" 
                value={customLength} 
                onChange={(e) => setCustomLength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-teal-500 cursor-pointer"
              />
              <p className="text-[9px] text-slate-500 italic leading-tight">
                *Hindura iyi minsi niba ukwezi kwawe kudafite iminsi 28 isanzwe. Ibi bizahindura uburyo tubara iminsi y'uburumbuke.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-100">
              <Heart size={28} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                {isAnonymous ? 'Umunyabanga' : 'Murakaza Neza'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Mperekeza APP — kurikirana ubuzima bwawe</p>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isAnonymous ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                  {isAnonymous ? 'Modi y\'ibanga' : 'Diane Akaliza'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Umunsi ugezeho muri uyu kwezi</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 transition-all">
                Umunsi wa {todayCycleDay} <span className="text-slate-300 mx-1">/</span> {effectiveLength}
              </span>
            </div>
            <div className="mt-2 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(todayCycleDay / effectiveLength) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ACCOUNT & PRIVACY */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Ubwigenge</h3>
          <div className="space-y-1">
            <SettingsRow
              icon={isAnonymous ? EyeOff : Eye}
              label="Kwiyerekana"
              sublabel={isAnonymous ? 'Amazina yawe ntarasohoka' : 'Amazina yawe aragaragara'}
              iconColor={isAnonymous ? 'text-amber-600' : 'text-teal-600'}
              iconBg={isAnonymous ? 'bg-amber-50' : 'bg-teal-50'}
              toggle
              checked={isAnonymous}
              onToggle={toggleAnonymous}
            />
            <SettingsRow
              icon={Lock}
              label="Ubwigenge bw'Amakuru"
              sublabel="Amakuru yawe ni ubwiru kandi ntagurishwa"
              iconColor="text-slate-600"
              iconBg="bg-slate-100"
            />
            <SettingsRow
              icon={Shield}
              label="Amategeko y'Ubwigenge"
              sublabel="Soma amategeko yacu yuzuye"
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Ibivugururwa</h3>
          <div className="space-y-1">
            <SettingsRow
              icon={Bell}
              label="Itangazo ry'Umunsi"
              sublabel="Akira message zikubwira inama y'umunsi"
              iconColor="text-rose-600"
              iconBg="bg-rose-50"
              toggle
              checked={true}
              onToggle={() => {}}
            />
            <SettingsRow
              icon={Bell}
              label="Itangazo ry'IMAHANGO"
              sublabel="Menya igihe imihango yawe izira"
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
              toggle
              checked={true}
              onToggle={() => {}}
            />
          </div>
        </div>

        {/* LANGUAGE & INFO */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Ururimi n'Amakuru</h3>
          <div className="space-y-1">
            <SettingsRow
              icon={Globe}
              label="Ururimi"
              sublabel="Kinyarwanda (Rwanda)"
              iconColor="text-teal-600"
              iconBg="bg-teal-50"
            />
            <SettingsRow
              icon={Info}
              label="Ibyerekeye Mperekeza"
              sublabel="Verisiyo 1.0.0"
              iconColor="text-slate-600"
              iconBg="bg-slate-100"
            />
          </div>
        </div>

        {/* FOOTER MESSAGE */}
        <div className="bg-gradient-to-br from-teal-50 to-rose-50 rounded-2xl p-6 border border-teal-100 shadow-inner">
          <p className="text-xs text-slate-600 text-center leading-relaxed font-medium">
            Mperekeza yakorewe abanyarwanda bose by'umwihariko igitsina gore mu rwego rwo kubafasha kumenya ukwezi kwabo k'umugore.{'\n'}
            <span className="text-teal-600">Iyo uzi uko umubiri wawe uhagaze birakorohera kuwubungabunga.</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-[1px] w-8 bg-rose-200" />
            <Heart size={14} className="text-rose-400 fill-rose-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gira ubuzima bwiza</span>
            <Heart size={14} className="text-rose-400 fill-rose-400 animate-pulse" />
            <div className="h-[1px] w-8 bg-rose-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
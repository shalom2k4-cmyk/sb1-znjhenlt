import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, RefreshCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCyclePhase, phaseColors, phaseLabels } from '../data/cycleContent';

const MONTHS = ['Mutarama','Gashyantare','Werurwe','Mata','Gicurasi','Kamena','Nyakanga','Kanama','Nzeli','Ukwakira','Ugushyingo','Ukuboza'];

export default function Tracker() {
  // STEP 1: Pull effectiveLength and isAdvancedMode from your Context
  const { 
    lastPeriodStart, 
    setLastPeriodStart, 
    getCycleDayForDate, 
    effectiveLength, 
    isAdvancedMode 
  } = useApp();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [monthOffset, setMonthOffset] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const today = new Date();
  const displayDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();

  // STEP 2: Update this function to pass the new variables to the "Brain"
  const getDayDetails = (date: Date) => {
    if (!lastPeriodStart) return null;
    const cycleDay = getCycleDayForDate(date);
    if (cycleDay === null) return null;
    
    // We now pass todayCycleDay, the length from the slider, AND the mode status
    const phase = getCyclePhase(cycleDay, effectiveLength, isAdvancedMode);
    return { cycleDay, phase };
  };

  const handleDateClick = (d: number) => {
    const clicked = new Date(displayDate.getFullYear(), displayDate.getMonth(), d);
    if (!lastPeriodStart) {
      setLastPeriodStart(clicked);
    }
    setSelectedDate(clicked);
  };

  const handleReset = () => {
    setLastPeriodStart(null);
    setIsResetting(false);
    setMonthOffset(0);
  };

  const checkIsToday = (d: number) => {
    const dateToCheck = new Date(displayDate.getFullYear(), displayDate.getMonth(), d);
    return dateToCheck.toDateString() === today.toDateString();
  };

  const selectedDetails = getDayDetails(selectedDate);
  const currentPhase = selectedDetails ? selectedDetails.phase : 'follicular';
  const colors = phaseColors[currentPhase];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className={`transition-all duration-700 bg-gradient-to-br ${colors.bg} pt-16 px-6 pb-10 rounded-b-[40px] shadow-sm`}>
        <div className="max-w-md mx-auto">
          {!lastPeriodStart ? (
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-800">Umunsi wa mbere?</h1>
              <p className="text-slate-600 font-medium leading-relaxed">Kanda ku itariki imihango yawe Iherutse gutangiriraho.</p>
            </div>
          ) : (
            <div className="flex justify-between items-end">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${colors.text}`}>
                  {phaseLabels[currentPhase]}
                </p>
                <h1 className="text-4xl font-black text-slate-800">Umunsi wa {selectedDetails?.cycleDay}</h1>
                <p className="text-slate-500 text-sm font-medium">
                  {selectedDate.toLocaleDateString('rw-RW', { day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div className="bg-white/40 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                <Droplets className={selectedDetails?.cycleDay! <= 5 ? 'text-rose-500' : 'text-slate-300'} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/60 border border-white">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setMonthOffset(p => p - 1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-slate-400" />
            </button>
            <h2 className="font-bold text-slate-800">{MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}</h2>
            <button onClick={() => setMonthOffset(p => p + 1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {['Ku','Ma','Wa','Ka','Ku','Gi','Za'].map((d) => (
              <div key={d} className="text-[10px] font-bold text-slate-300 uppercase">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const dateObj = new Date(displayDate.getFullYear(), displayDate.getMonth(), d);
              const details = getDayDetails(dateObj);
              const isSelected = selectedDate.toDateString() === dateObj.toDateString();
              const isStartDay = lastPeriodStart?.toDateString() === dateObj.toDateString();
              const todayCheck = checkIsToday(d);

              return (
                <button
                  key={d}
                  onClick={() => handleDateClick(d)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected ? 'bg-slate-800 text-white z-10 scale-105 shadow-lg' : 'hover:bg-slate-50'
                  } ${isStartDay ? 'ring-2 ring-rose-400' : ''} ${todayCheck ? 'ring-2 ring-teal-400' : ''}`}
                >
                  <span className="text-xs font-bold">{d}</span>
                  {details && (
                    <span className={`text-[8px] font-bold ${isSelected ? 'text-slate-400' : 'text-slate-300'}`}>
                      {details.cycleDay}
                    </span>
                  )}
                  {todayCheck && !isSelected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}
                  {details && details.cycleDay <= 5 && !isSelected && !todayCheck && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          {lastPeriodStart && (
            <>
              {!isResetting ? (
                <button 
                  onClick={() => setIsResetting(true)}
                  className="w-full py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold"
                >
                  <RefreshCcw size={14} />
                  Gusaba guhindura itariki
                </button>
              ) : (
                <div className="bg-rose-50 border border-rose-100 rounded-[24px] p-4 animate-in fade-in zoom-in duration-300">
                  <p className="text-xs font-bold text-rose-900 text-center mb-3">
                    Ese urashaka guhindura itariki yatangiriyeho?
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleReset}
                      className="flex-1 bg-rose-500 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-200"
                    >
                      Yego
                    </button>
                    <button 
                      onClick={() => setIsResetting(false)}
                      className="flex-1 bg-white text-slate-500 py-2 rounded-xl text-xs font-bold border border-rose-100"
                    >
                      Hoya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
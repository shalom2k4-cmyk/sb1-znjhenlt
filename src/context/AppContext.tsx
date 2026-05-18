import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Mood =
  | 'ibyishimo'
  | 'agahinda'
  | 'umunaniro'
  | 'umujinya'
  | 'impungenge'
  | 'mutuje'
  | 'intege_nke'
  | 'ubushake'
  | 'gushidikanya'
  | 'nguvu_nyinshi'
  | null;

export type Flow = 'ntayo' | 'macye' | 'aringaniye' | 'menshi' | null;

export type Symptom =
  | 'umutwe'
  | 'umugongo'
  | 'kuribwa'
  | 'umunaniro'
  | 'ububobere'
  | 'kuzura_inda'
  | 'amabere'
  | 'ibiheri'
  | 'umunsi_mubi'
  | null;

export interface DayLog {
  mood: Mood;
  flow: Flow;
  symptoms: Symptom[];
}

export interface AppState {
  lastPeriodStart: Date | null;
  setLastPeriodStart: (date: Date | null) => void;
  getCycleDayForDate: (date: Date) => number | null;
  todayCycleDay: number;
  isAnonymous: boolean;
  toggleAnonymous: () => void;
  dayLogs: Record<number, DayLog>;
  logDay: (day: number, log: Partial<DayLog>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdvancedMode: boolean;
  setIsAdvancedMode: (val: boolean) => void;
  customLength: number;
  setCustomLength: (val: number) => void;
  effectiveLength: number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lastPeriodStart, setLastPeriodStartState] = useState<Date | null>(() => {
    const saved = localStorage.getItem('lastPeriodStart');
    return saved ? new Date(saved) : null;
  });

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dayLogs, setDayLogs] = useState<Record<number, DayLog>>({});
  const [activeTab, setActiveTab] = useState('auth');
  
  // Advanced Mode State
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [customLength, setCustomLength] = useState(28);

  // This ensures that even if customLength is changed, 
  // the app uses 28 UNLESS isAdvancedMode is specifically turned ON.
  const effectiveLength = isAdvancedMode ? customLength : 28;

  const getCycleDayForDate = (date: Date): number | null => {
    if (!lastPeriodStart) return null;

    const d1 = new Date(lastPeriodStart.getFullYear(), lastPeriodStart.getMonth(), lastPeriodStart.getDate());
    const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffInTime = d2.getTime() - d1.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    // If the selected calendar date is before the start date, we don't show a cycle day
    if (diffInDays < 0) return null;

    // THE PREDICTION ENGINE:
    // (diffInDays % effectiveLength) resets the count every time a cycle ends.
    // If effectiveLength is 33, it will count 1 to 33, then start at 1 again.
    return (diffInDays % effectiveLength) + 1;
  };

  // Today's status (Defaults to Day 1 if no date is set)
  const todayCycleDay = getCycleDayForDate(new Date()) || 1;

  const setLastPeriodStart = (date: Date | null) => {
    setLastPeriodStartState(date);
    if (date) {
      localStorage.setItem('lastPeriodStart', date.toISOString());
    } else {
      localStorage.removeItem('lastPeriodStart');
    }
  };

  useEffect(() => {
    if (lastPeriodStart) {
      localStorage.setItem('lastPeriodStart', lastPeriodStart.toISOString());
    }
  }, [lastPeriodStart]);

  const toggleAnonymous = () => setIsAnonymous(prev => !prev);

  const logDay = (day: number, log: Partial<DayLog>) => {
    setDayLogs(prev => ({
      ...prev,
      [day]: {
        mood: null,
        flow: null,
        symptoms: [],
        ...prev[day],
        ...log,
      },
    }));
  };

  return (
    <AppContext.Provider value={{
      lastPeriodStart,
      setLastPeriodStart,
      getCycleDayForDate,
      todayCycleDay,
      isAnonymous,
      toggleAnonymous,
      dayLogs,
      logDay,
      activeTab,
      setActiveTab,
      isAdvancedMode,
      setIsAdvancedMode,
      customLength,
      setCustomLength,
      effectiveLength
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
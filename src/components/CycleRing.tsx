import { getCyclePhase, phaseLabels, phaseColors } from '../data/cycleContent';

interface CycleRingProps {
  day: number;
  totalDays?: number;
}

export default function CycleRing({ day, totalDays = 28 }: CycleRingProps) {
  // FIX: Added totalDays here so colors and labels update when the slider moves!
  const phase = getCyclePhase(day, totalDays);
  const colors = phaseColors[phase];
  const label = phaseLabels[phase];

  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress relative to the total length (28 or custom)
  const progress = (day / totalDays) * circumference;

  const daysUntilPeriod = totalDays - day + 1;
  
  // Custom text logic for the countdown
  let nextPeriodText = "";
  if (daysUntilPeriod <= 0) {
    nextPeriodText = "Igihe kirageze";
  } else if (daysUntilPeriod === 1) {
    nextPeriodText = "Ejo ni imihango";
  } else {
    nextPeriodText = `Iminsi ${daysUntilPeriod}`;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle (Empty track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle (Colored) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-800">{day}</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5">Umunsi</span>
          <span className="text-[10px] text-slate-400 mt-1 text-center px-4 leading-tight">
            {nextPeriodText} kugeza ku mihango
          </span>
        </div>
      </div>

      <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${colors.badge}`}>
        {label}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { 
  ClipboardList, ChevronLeft, ChevronRight, Shield, Heart, 
  Droplets, Star, Users, Pill, Activity, Lightbulb, Volume2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CycleRing from '../components/CycleRing';
import LoggerModal from '../components/LoggerModal';
import {
  getDayInsight,
  getDidYouKnow,
  getMensesPrediction,
  getCyclePhase,
  phaseColors,
} from '../data/cycleContent';

function getWatermarkClass(cycleDay: number): string {
  if (cycleDay >= 1 && cycleDay <= 5) return 'watermark-agaseke';
  if (cycleDay >= 6 && cycleDay <= 12) return 'watermark-hills';
  if (cycleDay >= 13 && cycleDay <= 16) return 'watermark-cattle';
  return 'watermark-sun';
}

const iconMap: Record<string, React.ElementType> = {
  shield: Shield, heart: Heart, droplets: Droplets, star: Star,
  users: Users, pill: Pill, stethoscope: Activity, alert: Activity,
};

export default function Home() {
  const { todayCycleDay, effectiveLength, lastPeriodStart } = useApp();
  const [showLogger, setShowLogger] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  const insight = getDayInsight(todayCycleDay, effectiveLength);
  const didYouKnow = getDidYouKnow(factIndex);
  const prediction = getMensesPrediction(todayCycleDay, effectiveLength);
  const phase = getCyclePhase(todayCycleDay, effectiveLength);
  const colors = phaseColors[phase];

  const totalFacts = 8;
  const watermarkClass = getWatermarkClass(todayCycleDay);

  return (
    <div className="min-h-screen bg-[#FDFCF8] pb-28 relative overflow-hidden">
      {/* Cultural Watermark Layer */}
      <div className={`fixed inset-0 pointer-events-none opacity-[0.04] z-0 ${watermarkClass}`} />

      {/* Main Container */}
      <div className="max-w-md mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="px-6 pt-14 pb-6">
          <div className="flex flex-col items-start gap-1 mb-1">
            {/* Logo display badge designed for your rectangular Logo.png layout */}
            <div className="w-16 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 shadow-sm border border-slate-100 mb-2">
              <img 
                src="/Logo.png" 
                alt="Mperekeza Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-[#1A237E]">Ahabanza</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Mperekeza</p>
          </div>

          <div className="imigongo-separator mb-6" />

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">
              Umunsi <span className="text-[#00A1DE] font-bold">{todayCycleDay}</span> w'ukwezi kwawe
            </div>
            <button
              onClick={() => setShowLogger(true)}
              className="flex items-center gap-2 bg-[#00A1DE] hover:bg-[#0088B8] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-transform active:scale-95"
            >
              <ClipboardList size={15} />
              Andika
            </button>
          </div>
        </header>

        {/* Interactive Content */}
        <main className="px-5 space-y-6">
          
          {/* Cycle Visualization */}
          <div className="flex justify-center mb-2">
            <CycleRing day={todayCycleDay} totalDays={effectiveLength} />
          </div>

          {/* Clinical Prediction Banner */}
          {lastPeriodStart ? (
            <div className={`rounded-2xl px-4 py-3 flex items-start gap-3 border ${
              prediction.status === 'warning' ? 'bg-amber-50 border-amber-200' : 
              prediction.status === 'imminent' ? 'bg-rose-50 border-rose-200' : 
              'bg-white/60 border-white/40'
            }`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                prediction.status === 'warning' ? 'bg-amber-400' : 
                prediction.status === 'imminent' ? 'bg-rose-400' : 'bg-teal-400'
              }`} />
              <p className="text-xs font-medium text-gray-700 leading-relaxed">{prediction.message}</p>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3">
              <p className="text-xs font-medium text-teal-800">
                Kanda ku <strong>Imihango</strong> hasi kugira ngo utangire.
              </p>
            </div>
          )}

          {/* Daily Medical Insight Card */}
          <section className="glass-card p-6 rounded-[24px] border border-white/40 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl leading-none flex-shrink-0">{insight.emoji}</span>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#00A1DE] mb-1">Inama y'Umunsi</p>
                <h2 className="text-lg font-black text-[#1A237E] leading-tight mb-2">{insight.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{insight.message}</p>
              </div>
            </div>

            {/* Audio Revision Button - Key Feature for iAccelerator */}
            <button className="w-full bg-[#FAD201] hover:bg-[#E6BE00] text-[#1A237E] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95">
              <Volume2 size={16} />
              UMVA AUDIO (REVISE)
            </button>
          </section>

          {/* Cultural "Did You Know" Card */}
          <section className="bg-[#FFFDE7] border-2 border-dashed border-[#FAD201] rounded-[24px] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb size={18} className="text-[#FAD201]" />
                <p className="text-[10px] font-black uppercase text-gray-700">Wari Uzi Ko?</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setFactIndex(i => (i - 1 + totalFacts) % totalFacts)}
                  className="p-1 hover:bg-white/50 rounded-full"
                >
                  <ChevronLeft size={16} className="text-gray-400" />
                </button>
                <span className="text-[10px] font-bold text-gray-400">{factIndex + 1}/{totalFacts}</span>
                <button 
                  onClick={() => setFactIndex(i => (i + 1) % totalFacts)}
                  className="p-1 hover:bg-white/50 rounded-full"
                >
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {(() => {
                const IconComp = iconMap[didYouKnow.icon] ?? Shield;
                return (
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <IconComp size={18} className="text-[#FAD201]" />
                  </div>
                );
              })()}
              <div className="flex-1">
                <span className="inline-block text-[8px] font-black uppercase tracking-wider text-[#B89600] bg-white/60 px-2 py-0.5 rounded-full mb-1.5">
                  {didYouKnow.category}
                </span>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{didYouKnow.fact}</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {showLogger && <LoggerModal onClose={() => setShowLogger(false)} />}
    </div>
  );
}
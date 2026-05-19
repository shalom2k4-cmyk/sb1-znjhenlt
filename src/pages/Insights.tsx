import { useState } from 'react';
import { Shield, Droplets, Star, Clock, X, ArrowLeft, Video, Volume2 } from 'lucide-react';
import { insights, insightCategories, Insight } from '../data/insights';

type Category = 'all' | 'hiv' | 'hygiene' | 'future';

const categoryIcons = { shield: Shield, droplets: Droplets, star: Star };

// Helper function to safely convert standard YouTube links to Embed format
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  // Handles standard watch links: youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Handles short links: youtu.be/VIDEO_ID
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url; // Returns original if it's already an embed link or alternate layout
};

function InsightDetail({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const cat = insightCategories[insight.category];
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto pb-24">
      <div className="relative">
        <img src={insight.image} alt={insight.title} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <ArrowLeft size={18} className="text-slate-700" />
        </button>
      </div>
      <div className="max-w-md mx-auto px-4 -mt-6 relative">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${cat.bg} ${cat.color}`}>
            {cat.label}
          </span>
          <h1 className="text-xl font-bold text-slate-800 mt-3 mb-2">{insight.title}</h1>
          <div className="flex items-center gap-1 mb-4">
            <Clock size={12} className="text-slate-400" />
            <span className="text-xs text-slate-400">{insight.readTime} iminota yo gusoma</span>
          </div>

          {insight.videoUrl && (
            <div className="mt-4 mb-4 bg-slate-100 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-900 to-slate-700">
                <Video size={16} className="text-white" />
                <span className="text-xs font-semibold text-white">Imashini y'ivideo</span>
              </div>
              <iframe
                src={getEmbedUrl(insight.videoUrl)}
                title={insight.title}
                className="w-full h-48"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {insight.audioUrl && (
            <div className="mt-4 mb-4 bg-slate-100 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-teal-600 to-teal-700">
                <Volume2 size={16} className="text-white" />
                <span className="text-xs font-semibold text-white">Ijwi</span>
              </div>
              <audio
                controls
                className="w-full p-3"
                controlsList="nodownload"
              >
                <source src={insight.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}

          <p className="text-sm text-slate-600 leading-relaxed">{insight.content}</p>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">{insight.summary}</p>
        </div>
      </div>
    </div>
  );
}

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selected, setSelected] = useState<Insight | null>(null);

  const filtered = activeCategory === 'all' ? insights : insights.filter(i => i.category === activeCategory);

  if (selected) return <InsightDetail insight={selected} onClose={() => setSelected(null)} />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 pt-safe">
        <div className="max-w-md mx-auto px-4 pt-12 pb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Ubumenyi</h1>
          <p className="text-teal-100 text-sm">Amakuru y'ubuzima mu Kinyarwanda</p>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-white text-teal-600 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Byose
            </button>
            {(Object.entries(insightCategories) as [keyof typeof insightCategories, typeof insightCategories[keyof typeof insightCategories]][]).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as Category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === key
                    ? 'bg-white text-teal-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        {filtered.map(insight => {
          const cat = insightCategories[insight.category];
          const IconComp = categoryIcons[cat.icon as keyof typeof categoryIcons] ?? Shield;
          return (
            <button
              key={insight.id}
              onClick={() => setSelected(insight)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
            >
              <img
                src={insight.image}
                alt={insight.title}
                className="w-24 h-24 object-cover flex-shrink-0"
              />
              <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.bg} ${cat.color} mb-1.5`}>
                    <IconComp size={9} />
                    {cat.label}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{insight.title}</h3>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400">{insight.readTime} min</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp, Mood, Flow, Symptom } from '../context/AppContext';

interface LoggerModalProps {
  onClose: () => void;
}

const moods: { id: Mood; label: string; emoji: string }[] = [
  { id: 'ibyishimo', label: 'Ibyishimo', emoji: '😊' },
  { id: 'agahinda', label: 'Agahinda', emoji: '😔' },
  { id: 'umunaniro', label: 'Umunaniro', emoji: '😴' },
];

const flows: { id: Flow; label: string; color: string; description: string }[] = [
  { 
    id: 'ntayo', 
    label: 'Nta mihango ihari', 
    color: 'bg-rose-50 text-rose-400 border-rose-100',
    description: 'Uyu munsi nta maraso uri kubona. Ni igihe cyo guteganya igihe izazira ukoresheje kalendari.' 
  },
  { 
    id: 'macye', 
    label: 'amaraso macye cyane (Spotting)', 
    color: 'bg-rose-100 text-rose-600 border-rose-200',
    description: 'Iyo ari amaraso macye cyane aza nk’ibitonyanga. Bikunze kubaho imihango igitangira cyangwa igiye kurangira.' 
  },
  { 
    id: 'aringaniye', 
    label: 'AMARASO Aringaniye (Medium)', 
    color: 'bg-rose-200 text-rose-700 border-rose-300',
    description: 'Uku niko imihango isanzwe igenda ku bakobwa benshi. Uhindura impapuro z’isuku (pads) inshuro 3 kugeza kuri 4 ku munsi.' 
  },
  { 
    id: 'menshi', 
    label: 'AMARASO menshi (Heavy)', 
    color: 'bg-rose-400 text-white border-rose-500',
    description: 'Iyo imihango ari myinshi cyane, uba ugomba guhindura pad buri masaha abiri. Nywa amazi menshi kuko umubiri uba uri gutakaza amaraso.' 
  },
];

const symptoms: { id: Symptom; label: string; emoji: string; note: string }[] = [
  { 
    id: 'umutwe', 
    label: 'Kuribwa n\'umutwe', 
    emoji: '🤕', 
    note: 'Guhindagurika kw imisemburo mu gihe cy imihango CG uyu munsi gushobora gutera umutwe ukomeye bityo ni byiza kuryama mu cyumba kimeze neza kirimo umwijima n amahumbezi kandi gushyira amazi akonje mu gahanga bishobora kugufasha kugabanya ubwo buribwe mu buryo bworoshye butuma ubasha kuruhuka neza ngo umubiri wawe usubirane imbaraga mu mutuzo usesuye nta nkomyi kuko kwita ku buryo uruhuka ari ingenzi cyane mu koroshya ibimenyetso byose bijyana n\'icyi gihe urimo mu buzima bwawe bwa buri munsi bityo uyu munsi nicyo twagombaga kuganiraho binyuze mu gushaka uburyo bwo kugabanya ubwo bubabare mu buryo bwa kamere kandi bwizewe mu bihe turimo ubu,hagamijwe kurengera amagara yawe neza mu buryo bwizewe kandi buhoraho, uwo mutwe uterwa n imisemburo rero gerageza kubahiriza aya mabwiriza y isuku unaruhuka kugira ngo urusheho kugira ubuzima bwiza mu bihe byose' 
  },
  { 
    id: 'umugongo', 
    label: 'Ububabare bw\'umugongo', 
    emoji: '💆', 
    note: 'Iyo nyababyeyi yikora kugira ngo isohore amaraso y imihango bishobora gutera uburibwe mu mugongo no mu matako bityo kuryama uhetamye cyane cyane ku ruhande ni uburyo bwiza bwo gufasha imitsi yo mu mugongo kuruhuka no kugabanya ubwo bubabare mu buryo bworoshye butuma umubiri urushaho kumererwa neza mu gihe cy imihango. mu gihe umugongo ukuriye uri mu kazi cg ku munsi gerageza gushaka umusego uwicareho neza mu buryo butakubangamiye. irinde kuba imbata y\'ibinini bigabanya uburibwe kuko byazakugiraho ingaruka mu gihe runaka' 
  },
  { 
    id: 'kuribwa', 
    label: 'Ibise by\'imihango (Cramps)', 
    emoji: '😖', 
    note: 'Uburibwe bw\'inda yo hasi mu gihe cy imihango bushobora kugabanuka binyuze mu kunywa icyayi gishyushye cyane nk`icyayi cya tangawizi no gushyira icupa rishyushye ku nda kuko ubu bushyuhe bufasha imitsi yikanyaze kwirekura maze uburibwe bukagabanuka mu buryo bwihuse butuma umubiri umererwa neza kandi ukaruhuka mu mutuzo usesuye nta nkomyi kuko ari uburyo bworoshye kandi bufasha mu koroshya ubwo bubabare mu buryo bwa kamere butangiza umubir' 
  },
  { 
    id: 'umunaniro', 
    label: 'Kumva unaniwe cyane', 
    emoji: '😴', 
    note: 'Umubiri wawe ukoresha imbaraga nyinshi uri gutegura imihango bityo niba wumva ufite intege nke ntiwikoreze ibintu biremereye ahubwo fata akanya uruhuke kandi uryame amasaha ahagije nibura amasaha umunani kugira ngo ufashe umubiri wawe kugarura imbaraga no kumererwa neza mu mutuzo usesuye nta nkomyi kuko kuruhuka bihagije ari inkingi ya mwamba mu guhangana n umunaniro n intege nke ziza muri icyo gihe cy imihango hagamijwe kubungabunga amagara yawe neza mu buryo buhoraho kandi bwizewe' 
  },
  { 
    id: 'ububobere', 
    label: 'Ububobere bwo mu gitsina', 
    emoji: '💧', 
    note: 'ububobere bufashe: ovulation, ubudafashe: ntabwo igi rirasohoka ..Amatembabuzi asohoka mu gitsina arahindagurika bitewe n igihe ugeze mu kwezi kwawe bityo iyo ubonye ameze nk umweru w igi kandi akweduka biba bisobanuye ko uri mu bihe by uburumbuke aho ushobora gusama byoroheje mu gihe ukoze imibonano mpuzabitsina idakingiye bityo kumenya aya maczi y umubiri wawe ava mu gitsina uko ameze ni ingenzi kugira ngo ubashe kugenzura ubuzima bwawe bw imyororokere n amagara yawe muri rusange mu buryo bwizewe kandi buhamye mu mibereho yawe ya buri munsi nta nkomyi na namba binyuze mu gushishoza no gusobanukirwa n impinduka z umubiri wawe ufite ubumenyi buhagije bukurinda gutungurwa n amakuru amwe n`amwe y amagara yawe mu bihe bitandukanye by ukwezi kw umugore.'
  },
  { 
    id: 'icyuka cyo mu nda', 
    label: 'Kuzura imyuka mu nda', 
    emoji: '🎈', 
    note: 'Kumva inda yabyimbye biterwa nuko umubiri uba wabitse amazi menshi bityo ni ngombwa kwirinda umunyu mwinshi inzoga n isukari kuko bituma inda irushaho kumererwa nabi maze ukanywa amazi ahagije kugira ngo ufashe umubiri kumererwa neza no kugabanya ubwo bubyimbane mu buryo bworoshye kandi bwizewe mu gihe cy imihango hagamijwe kubungabunga amagara yawe neza mu mutuzo usesuye nta nkomyi na namba' 
  },
  { 
    id: 'amabere', 
    label: 'Kuribwa cyangwa kubyimba amabere', 
    emoji: '🍒', 
    note: 'Mbere y’uko imihango iza, amabere ashobora kumva aremereye kandi akaryana uko uyakozeho. Kwambara isutiya igufashe neza itatuma anyeganyega (sports bra) bituma utumva uburibwe cyane.' 
  },
  { 
    id: 'ibiheri', 
    label: 'Ibiheri byo mu maso (Acne)', 
    emoji: '✨', 
    note: 'Imisemburo ituma uruhu rusohora amavuta menshi bigatera ibiheri. Gerageza koga mu maso inshuro ebyiri ku munsi n’isabune yoroheje, kandi wirinde kubitumbura kuko bishobora gusiga inkovu.' 
  },
  { 
    id: 'umunsi_mubi', 
    label: 'Guhinduka kw\'uyiyumvo (Mood)', 
    emoji: '🎭', 
    note: 'Ushobora kumva urakara vuba, ushaka kurira, cyangwa ufite agahinda nta mpamvu. Menya ko ari imisemburo ibitera kandi bitaza gukuraho ibyishimo byawe. Ganira n’incuti cyangwa ukore ikintu kigushimisha.' 
  }
];



export default function LoggerModal({ onClose }: LoggerModalProps) {
  const { todayCycleDay: cycleDay, logDay } = useApp();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [selectedFlow, setSelectedFlow] = useState<Flow>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleSymptom = (s: Symptom) => {
    const note = symptoms.find(x => x.id === s)?.note ?? null;
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(prev => prev.filter(x => x !== s));
      setLastNote(null);
    } else {
      setSelectedSymptoms(prev => [...prev, s]);
      setLastNote(note);
    }
  };

  const handleSave = () => {
    logDay(cycleDay, { mood: selectedMood, flow: selectedFlow, symptoms: selectedSymptoms });
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 pb-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Andika Ubuzima bwawe</h2>
            <p className="text-xs text-slate-500 mt-0.5">Umunsi wa {cycleDay} — Uyu munsi</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Ibyishimo (Mood)</h3>
          <div className="flex gap-3">
            {moods.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all duration-200 ${
                  selectedMood === m.id
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-medium text-slate-600">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Amaraso (Flow)</h3>
          <div className="flex gap-2">
            {flows.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFlow(f.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all duration-200 ${f.color} ${
                  selectedFlow === f.id ? 'ring-2 ring-offset-1 ring-rose-400 scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Ibimenyetso (Symptoms)</h3>
          <div className="grid grid-cols-2 gap-2">
            {symptoms.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedSymptoms.includes(s.id)
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                <span className="text-lg">{s.emoji}</span>
                <span className="text-xs font-medium text-slate-600 leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        {lastNote && (
          <div className="mb-5 p-3 bg-teal-50 border border-teal-200 rounded-xl">
            <p className="text-xs text-teal-700 leading-relaxed">{lastNote}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white active:scale-95'
          }`}
        >
          {saved ? (
            <>
              <Check size={18} />
              Byongewe!
            </>
          ) : (
            'Bika Amakuru'
          )}
        </button>
      </div>
    </div>
  );
}

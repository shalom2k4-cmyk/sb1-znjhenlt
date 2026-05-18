import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Star, Phone, X, Send, Bot, User, Clock,
  Smartphone, CheckCircle, AlertCircle, Zap, Shield, ArrowLeft,
  Wifi, Lock, Mic, MicOff, Play, Pause, PhoneCall, PhoneOff,
  StopCircle, Video, Camera, Maximize2
} from 'lucide-react';
import { doctors, Doctor } from '../data/doctors';

// ─── Types ───────────────────────────────────────────────────────────────────

type ConsultMode = 'select' | 'momo' | 'doctor-select' | 'call-doctor-select' | 'video-doctor-select' | 'chat-ai' | 'chat-doctor' | 'phone-call' | 'video-call';
type MoMoPurpose = 'chat' | 'phone-call' | 'video-call';

interface VoiceNote {
  id: string;
  duration: number;
  url: string;
}

interface ChatMessage {
  from: 'user' | 'doctor' | 'ai' | 'system';
  text?: string;
  voiceNote?: VoiceNote;
  time: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getAiReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('sida') || t.includes('hiv')) {
    return 'Kwisuzumisha SIDA ni intambwe ya mbere. Muri Rwanda, serivisi zo kwisuzumisha ni ubuntu kandi zibanga. Nifuza kukubwira byinshi. Ese ufite ikibazo runaka?';
  }
  if (t.includes('imihango') || t.includes('period') || t.includes('mihango')) {
    return 'Imihango y\'abagore ishobora guhinduka bitewe n\'imirire, stress, cyangwa imisemburo. Niba imihango yawe idafite iminsi 21-35 buri kwezi, ni ngombwa kubaza muganga. Nshaka kukubwira byinshi, baza ikibazo cyanyu.';
  }
  if (t.includes('ububabare') || t.includes('kubabara') || t.includes('pain') || t.includes('kuribwa')) {
    return 'Uburibwe bw\'inda mu gihe cy\'imihango (dysmenorrhea) ni ibisanzwe. Amakuru meza: gushyira agatambaro gashyushye ku nda no kunywa amazi menshi bishobora gufasha. Niba uburibwe bukabije, baza muganga.';
  }
  if (t.includes('imiti') || t.includes('medicine') || t.includes('arv') || t.includes('prep')) {
    return 'Imiti y\'ubuzima igomba guhabwa na muganga wemewe gusa. Ntukagure imiti ku isoko nta ruhushya. Turashobora kukubwira aho ushobora kubona inama z\'ubufatanye n\'inzobere.';
  }
  if (t.includes('condom') || t.includes('agakingirizo')) {
    return 'Condom ni inzira yonyine ikingira icyarimwe SIDA, STIs, n\'inda itateganyijwe. Ikorwa neza iyo ikoreshwa neza buri nshuro. Wifuza inama nyinshi ku buryo bwo kuyikoresha?';
  }
  if (t.includes('ovulation') || t.includes('gusama') || t.includes('uburumbuke')) {
    return 'Uburumbuke bukunze kubaho hagati y\'iminsi 12-16 y\'ukwezi kw\'iminsi 28. Ibimenyetso birimo: amatembabuzi ava mu gitsina afashe, ubushyuhe bw\'umubiri bwiyongera. Wifuza kumenya ibyinshi?';
  }
  if (t.includes('murakoze') || t.includes('thanks') || t.includes('urakoze')) {
    return 'Murakoze namwe! Twishimiye kubafasha. Niba ufite ikibazo indi nshuro, ndi hano. Buka gufata inama na muganga nyakuri niba ikibazo gikomeza!';
  }
  if (t.includes('muraho') || t.includes('hello') || t.includes('bonjour')) {
    return 'Muraho! Ndi AI ya Mperekeza. Nshobora kukubwira amakuru y\'ubuzima bw\'imyororokere, SIDA, n\'isuku. Baza ikibazo cyawe, nzagerageza gufasha!';
  }
  return 'Murakoze kutwandikira. Ikibazo cyanyu ni ingenzi. Nshobora gutanga amakuru rusange, ariko kuri ikibazo gikomeye ni byiza kubaza muganga nyakuri. Wifuza gufungura ikibazo cyanyu birambuye?';
}

function getDoctorReply(text: string, doctor: Doctor): string {
  const t = text.toLowerCase();
  const name = doctor.name.split(' ')[1] || doctor.name;
  if (t.includes('sida') || t.includes('hiv')) {
    return `Nk'inzobere, mbwira ko kwisuzumisha hakiri kare ari ingenzi cyane. Nzakwohereza inyandiko y'isuzuma. Muri serivisi zacu za ${doctor.hospital}, twatanga imiti ya PrEP. Wifuza guteranira na ${name}?`;
  }
  if (t.includes('imihango') || t.includes('period')) {
    return `Mu bihe by'ubujyanama bwange, nasuye abagore benshi bafite ikibazo nk'icyanyu. Dufate amakuru yawe mbere: imihango iza ari myinshi cyangwa macye? Iminsi ingahe? Biratuma nfate ibyemezo neza.`;
  }
  if (t.includes('ububabare') || t.includes('pain')) {
    return `Uburibwe budasanzwe ni ikimenyetso cy'ikibazo gishobora kuvurwa. Mu ${doctor.hospital}, dufite imiti ikorwa neza. Nzakugenaheza. Ese uburibwe bwatangira ryari exactly?`;
  }
  return `Murakoze guhitamo ${doctor.hospital}. Ndumva ikibazo cyanyu neza. Nk'inzobere mu ${doctor.specialty}, nzakorana nawe gusanga umuti mwiza. Birambuza ikibazo cyanyu ngo nkugenaheze neza.`;
}

// ─── Voice Note Recorder Component ───────────────────────────────────────────

function VoiceNoteRecorder({ onSend }: { onSend: (note: VoiceNote) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    intervalRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const duration = recordingSeconds > 0 ? recordingSeconds : 1;
    setIsRecording(false);
    setRecordingSeconds(0);
    onSend({ id: `vn-${Date.now()}`, duration, url: '' });
  };

  const cancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  if (!isRecording) {
    return (
      <button
        onMouseDown={startRecording}
        onTouchStart={startRecording}
        className="w-11 h-11 rounded-2xl bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-all active:scale-90"
        title="Fata ijwi"
      >
        <Mic size={18} className="text-rose-600" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2">
      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
      <span className="text-xs font-bold text-rose-700 shrink-0">
        {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}
      </span>
      <div className="flex gap-0.5 items-center flex-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="bg-rose-400 rounded-full w-0.5 animate-pulse"
            style={{ height: `${6 + Math.abs(Math.sin(i * 0.9)) * 8}px`, animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      <button onClick={cancel} className="p-1 hover:bg-rose-200 rounded-lg transition-colors">
        <X size={14} className="text-rose-500" />
      </button>
      <button
        onClick={stopRecording}
        className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-all active:scale-90 shadow-md"
      >
        <StopCircle size={16} className="text-white" />
      </button>
    </div>
  );
}

// ─── Voice Note Playback Component ───────────────────────────────────────────

function VoiceNotePlayback({ note, isOwn }: { note: VoiceNote; isOwn: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setProgress(0);
    const step = 100 / (note.duration * 10);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return 0;
        }
        return p + step;
      });
    }, 100);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl min-w-[180px] ${isOwn ? 'bg-teal-600' : 'bg-white border border-slate-100'}`}>
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
          isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-teal-100 hover:bg-teal-200'
        }`}
      >
        {isPlaying
          ? <Pause size={14} className={isOwn ? 'text-white' : 'text-teal-600'} />
          : <Play size={14} className={isOwn ? 'text-white' : 'text-teal-600'} />
        }
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className={`h-1 rounded-full overflow-hidden ${isOwn ? 'bg-white/20' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-100 ${isOwn ? 'bg-white' : 'bg-teal-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-0.5 items-end">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full w-0.5 ${isOwn ? 'bg-white/40' : 'bg-slate-300'}`}
              style={{ height: `${4 + Math.abs(Math.sin(i * 0.7)) * 9}px` }}
            />
          ))}
        </div>
      </div>
      <span className={`text-[10px] font-bold shrink-0 ${isOwn ? 'text-white/70' : 'text-slate-400'}`}>
        {fmt(note.duration)}
      </span>
    </div>
  );
}

// ─── Selection Screen ─────────────────────────────────────────────────────────

function SelectionScreen({
  onSelectAI,
  onSelectDoctor,
  onSelectCall,
  onSelectVideo,
}: {
  onSelectAI: () => void;
  onSelectDoctor: () => void;
  onSelectCall: () => void;
  onSelectVideo: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 pt-16 pb-10 px-5">
        <div className="max-w-md mx-auto">
          <p className="text-teal-200 text-xs font-bold uppercase tracking-widest mb-1">Mperekeza</p>
          <h1 className="text-3xl font-black text-white mb-2">Ubujyanama</h1>
          <p className="text-teal-100 text-sm leading-relaxed">Hitamo uburyo bw'ubujyanama bukuguye.</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4">
        <div className="bg-white/90 backdrop-blur-sm border border-teal-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
            <Lock size={16} className="text-teal-600" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ikiganiro cyose ni <span className="font-bold text-teal-700">ibanga rikomeye</span>. Amakuru yawe ntashyirwa ahagaragara.
          </p>
        </div>

        {/* AI Card */}
        <button
          onClick={onSelectAI}
          className="w-full bg-white rounded-3xl p-5 shadow-md border border-slate-100 hover:shadow-xl transition-all active:scale-[0.98] text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
              <Bot size={28} className="text-white" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">UBUNTU / FREE</span>
              <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap size={9} />5 messages
              </span>
            </div>
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Vugisha Robot (AI)</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">Baza ibibazo by'ubuzima usubizwa vuba na AI yacu.</p>
          <div className="space-y-2 mb-4">
            {['Subiza vuba (hasi ya secondes 3)', 'Amakuru ku SIDA, STIs & Imihango', 'Ibisubizo mu Kinyarwanda'].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-teal-500 shrink-0" />
                <span className="text-xs text-slate-600">{f}</span>
              </div>
            ))}
          </div>
          <div className="bg-teal-500 group-hover:bg-teal-600 text-white rounded-2xl py-3 text-center text-sm font-bold transition-colors shadow-md shadow-teal-200">
            Tangira Ikiganiro
          </div>
        </button>

        {/* Chat Doctor Card */}
        <button
          onClick={onSelectDoctor}
          className="w-full bg-white rounded-3xl p-5 shadow-md border border-slate-100 hover:shadow-xl transition-all active:scale-[0.98] text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <MessageCircle size={28} className="text-white" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">1,000 RWF</span>
              <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Smartphone size={9} />MoMo Pay
              </span>
            </div>
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Vugisha Muganga (Chat)</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">Ganira na muganga nyakuri. Shyira ubutumwa cyangwa <span className="font-semibold text-rose-600">ijwi ryawe</span>.</p>
          <div className="space-y-2 mb-4">
            {['Muganga wemewe n\'u Rwanda', 'Iminota 10 + amajwi (Voice Notes)', 'Incamake nyuma y\'ikiganiro'].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-rose-500 shrink-0" />
                <span className="text-xs text-slate-600">{f}</span>
              </div>
            ))}
          </div>
          <div className="bg-rose-500 group-hover:bg-rose-600 text-white rounded-2xl py-3 text-center text-sm font-bold transition-colors shadow-md shadow-rose-200">
            Ishyura 1,000 RWF via MoMo
          </div>
        </button>

        {/* Phone Call Card */}
        <button
          onClick={onSelectCall}
          className="w-full bg-white rounded-3xl p-5 shadow-md border border-slate-100 hover:shadow-xl transition-all active:scale-[0.98] text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Phone size={28} className="text-white" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">5,000 RWF</span>
              <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Smartphone size={9} />MoMo Pay
              </span>
            </div>
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Hamagara Muganga</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">Vugana na muganga nyakuri ku telefoni kwa minota 15 y'ubujyanama bwihariye.</p>
          <div className="space-y-2 mb-4">
            {['Ikiganiro cya telefoni cy\'iminota 15', 'Muganga w\'inzobere akugeneye wenyine', 'Incamake yoherejwe nyuma y\'ikiganiro'].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-blue-500 shrink-0" />
                <span className="text-xs text-slate-600">{f}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-500 group-hover:bg-blue-600 text-white rounded-2xl py-3 text-center text-sm font-bold transition-colors shadow-md shadow-blue-200">
            Ishyura 5,000 RWF via MoMo
          </div>
        </button>

        {/* Video Call Card */}
        <button
          onClick={onSelectVideo}
          className="w-full bg-white rounded-3xl p-5 shadow-md border border-slate-100 hover:shadow-xl transition-all active:scale-[0.98] text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-transparent rounded-full -mr-8 -mt-8" />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-300">
              <Video size={28} className="text-white" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">8,000 RWF</span>
              <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap size={9} />Premium
              </span>
            </div>
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-1">Hamagara na Video (HD)</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">Ganira na muganga kubamuona. Ubujyanama bw'iminota 15 nyakuri bwambere.</p>
          <div className="space-y-2 mb-4">
            {['Ikiganiro cya video HD cy\'iminota 15', 'Muganga akugesha ibisobanuro byubuoni', 'Muganga ashobora kubona ibimenyetso bidashira'].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-purple-500 shrink-0" />
                <span className="text-xs text-slate-600">{f}</span>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 text-white rounded-2xl py-3 text-center text-sm font-black transition-all shadow-md shadow-purple-300">
            Ishyura 8,000 RWF via MoMo
          </div>
        </button>

        <div className="text-center py-2">
          <p className="text-[11px] text-slate-400">AI igufasha ku mibereho isanzwe • Chat/Call/Video ni ngombwa ku bibazo bikomeye</p>
        </div>
      </div>
    </div>
  );
}

// ─── MoMo Payment Modal ───────────────────────────────────────────────────────

function MoMoModal({
  onClose,
  onSuccess,
  amount,
  serviceLabel,
}: {
  onClose: () => void;
  onSuccess: () => void;
  amount: string;
  serviceLabel: string;
}) {
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [step, setStep] = useState<'form' | 'push' | 'confirm'>('form');

  const handlePay = () => {
    if (phone.length < 9) return;
    setStep('push');
    setTimeout(() => setStep('confirm'), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-t-[32px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`h-1.5 w-full ${provider === 'mtn' ? 'bg-yellow-400' : 'bg-red-500'}`} />
        <div className="p-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Kwishyura Binyuze kuri</p>
              <h2 className="text-xl font-black text-slate-800">Mobile Money</h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Ingano yo kwishyura</p>
              <p className="text-2xl font-black text-slate-800">{amount} <span className="text-base font-bold text-slate-400">RWF</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-0.5">Serivisi</p>
              <p className="text-sm font-bold text-teal-600">{serviceLabel}</p>
            </div>
          </div>

          {step === 'form' && (
            <>
              <div className="flex gap-3 mb-4">
                {(['mtn', 'airtel'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                      provider === p
                        ? p === 'mtn' ? 'border-yellow-400 bg-yellow-50 text-yellow-800' : 'border-red-400 bg-red-50 text-red-800'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {p === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}
                  </button>
                ))}
              </div>
              <div className="relative mb-5">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Smartphone size={16} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-500">+250</span>
                  <div className="w-px h-4 bg-slate-200" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="7XX XXX XXX"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-teal-400 rounded-2xl py-4 pl-28 pr-4 text-sm font-medium text-slate-700 outline-none transition-all"
                />
              </div>
              <button
                onClick={handlePay}
                disabled={phone.length < 9}
                className={`w-full py-4 rounded-2xl text-sm font-black transition-all shadow-lg ${
                  phone.length >= 9 ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-200 active:scale-95' : 'bg-slate-200 text-slate-400'
                }`}
              >
                Ishyura {amount} RWF
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield size={12} className="text-slate-400" />
                <p className="text-[10px] text-slate-400">Kwishyura binyuze kuri RwandaPayments yizewe</p>
              </div>
            </>
          )}

          {step === 'push' && (
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center relative">
                <Smartphone size={28} className="text-teal-500" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center">
                  <Wifi size={10} className="text-white" />
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-800 mb-1">USSD Push Yoherejwe!</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Reba telephone yawe (+250 {phone}). Emeza kwishyura kwa <span className="font-bold text-teal-600">{amount} RWF</span> kuri {provider.toUpperCase()} MoMo.
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
                <span className="text-xs font-medium ml-1">Gutegereza emeza...</span>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="py-4 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle size={36} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-800 mb-1">Kwishyura Byagenze Neza!</h3>
                <p className="text-sm text-slate-500 mb-1">{amount} RWF yavanwe kuri +250 {phone}</p>
                <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
                  TXN: MPR{Math.floor(Math.random() * 9000000 + 1000000)}
                </p>
              </div>
              <button
                onClick={onSuccess}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-teal-200 active:scale-95"
              >
                Komeza
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Doctor Select ────────────────────────────────────────────────────────────

function DoctorSelectScreen({
  onSelect,
  onBack,
  title,
  subtitle,
  accentColor = 'rose',
}: {
  onSelect: (d: Doctor) => void;
  onBack: () => void;
  title: string;
  subtitle: string;
  accentColor?: 'rose' | 'blue';
}) {
  const available = doctors.filter(d => d.available);
  const gradientClass = accentColor === 'blue' ? 'from-blue-500 to-blue-600' : 'from-rose-500 to-rose-600';
  const badgeBg = accentColor === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100';

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className={`bg-gradient-to-br ${gradientClass} pt-16 pb-8 px-5`}>
        <div className="max-w-md mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-white/70 text-sm font-medium mb-4 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Subira inyuma
          </button>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Kwishyura byagenze</p>
          <h1 className="text-2xl font-black text-white mb-1">{title}</h1>
          <p className="text-white/80 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 -mt-4 space-y-3">
        {available.map(doctor => (
          <button
            key={doctor.id}
            onClick={() => onSelect(doctor)}
            className="w-full bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition-all active:scale-[0.98] text-left"
          >
            <div className="flex gap-4 items-center">
              <div className="relative shrink-0">
                <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800">{doctor.name}</h3>
                <p className="text-xs text-teal-600 font-semibold mt-0.5">{doctor.specialty}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-600">{doctor.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{doctor.hospital}</span>
                </div>
              </div>
              <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
                Hitamo
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── AI Chat Screen ───────────────────────────────────────────────────────────

function AIChatScreen({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState('');
  const [messagesLeft, setMessagesLeft] = useState(5);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'ai', text: 'Muraho! Ndi AI ya Mperekeza. Nshobora kukufasha ku bibazo by\'ubuzima bw\'imyororokere, SIDA, isuku, n\'ibindi. Baza ikibazo cyawe, nzagerageza gufasha!', time: nowTime() },
    { from: 'system', text: 'Ibisubizo bya AI ntabwo bishobora gusubiranya inama ya muganga nyakuri.', time: '' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const send = () => {
    const trimmed = message.trim();
    if (!trimmed || messagesLeft === 0) return;
    const newLeft = messagesLeft - 1;
    setMessagesLeft(newLeft);
    setMessages(prev => [...prev, { from: 'user', text: trimmed, time: nowTime() }]);
    setMessage('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'ai', text: getAiReply(trimmed), time: nowTime() }]);
      if (newLeft === 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: 'system', text: 'Ubutumwa bwawe bwarangiye. Hitamo "Vugisha Muganga" kugira ngo ubashe gukomeza!', time: '' }]);
        }, 800);
      }
    }, 1400);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 pt-14 pb-4 shrink-0">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white">Mperekeza AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] text-teal-100 font-medium">Online</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black ${messagesLeft > 2 ? 'bg-white/20 text-white' : 'bg-amber-400 text-amber-900'}`}>
            {messagesLeft} msg
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-md mx-auto w-full">
        {messages.map((msg, i) => {
          if (msg.from === 'system') {
            return (
              <div key={i} className="flex justify-center">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium px-4 py-2 rounded-full flex items-center gap-1.5">
                  <AlertCircle size={11} />{msg.text}
                </div>
              </div>
            );
          }
          return (
            <div key={i} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-teal-600" />
                </div>
              )}
              <div className={`max-w-[78%] flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.from === 'user' ? 'bg-teal-500 text-white rounded-br-sm' : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                }`}>
                  {msg.text}
                </div>
                {msg.time && <span className="text-[9px] text-slate-400 px-1">{msg.time}</span>}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-teal-600" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">AI irimo gusubiza</span>
              {[0, 150, 300].map(d => (
                <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-slate-100 px-4 py-3 pb-28 shrink-0 max-w-md mx-auto w-full">
        {messagesLeft === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
            <p className="text-xs font-bold text-amber-800 mb-1">Ubutumwa bwawe bwarangiye</p>
            <p className="text-[10px] text-amber-600">Ishyura 1,000 RWF ubashe guganira na muganga nyakuri</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Andika ikibazo cyawe..."
              className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-400 transition-all"
            />
            <button
              onClick={send}
              disabled={!message.trim()}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-md ${
                message.trim() ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-slate-200 text-slate-400'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Doctor Chat Screen ───────────────────────────────────────────────────────

const CHAT_TOTAL_SECONDS = 10 * 60;

function DoctorChatScreen({ doctor, onBack }: { doctor: Doctor; onBack: () => void }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CHAT_TOTAL_SECONDS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'system', text: 'Ikiganiro cyatangiye. Ufite iminota 10. Urashobora kohereza ijwi cyangwa ubutumwa bwanditse.', time: '' },
    { from: 'doctor', text: `Muraho! Ndi ${doctor.name}, inzobere mu ${doctor.specialty}. Nigute nabafasha uyu munsi?`, time: nowTime() },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  useEffect(() => {
    if (sessionEnded) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSessionEnded(true);
          setMessages(m => [...m, { from: 'system', text: 'Ikiganiro cyarangiye. Incamake ibitswe hasi.', time: '' }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionEnded]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLastTwoMinutes = secondsLeft <= 120;
  const progressPct = ((CHAT_TOTAL_SECONDS - secondsLeft) / CHAT_TOTAL_SECONDS) * 100;

  const send = (textMsg?: string) => {
    const trimmed = (textMsg ?? message).trim();
    if (!trimmed || sessionEnded) return;
    setMessages(prev => [...prev, { from: 'user', text: trimmed, time: nowTime() }]);
    setMessage('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'doctor', text: getDoctorReply(trimmed, doctor), time: nowTime() }]);
    }, 1600);
  };

  const sendVoiceNote = (note: VoiceNote) => {
    if (sessionEnded) return;
    setMessages(prev => [...prev, { from: 'user', voiceNote: note, time: nowTime() }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyNote: VoiceNote = { id: `vn-reply-${Date.now()}`, duration: Math.floor(Math.random() * 8) + 4, url: '' };
      setMessages(prev => [...prev, { from: 'doctor', voiceNote: replyNote, time: nowTime() }]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className={`px-4 pt-14 pb-3 shrink-0 transition-colors duration-500 ${isLastTwoMinutes ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-teal-500 to-teal-600'}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-xl object-cover border-2 border-white/40" />
            <div className="flex-1">
              <h2 className="text-sm font-bold text-white leading-tight">{doctor.name}</h2>
              <div className="flex items-center gap-1.5">
                {!sessionEnded ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-[10px] text-white/80 font-medium">Online • {doctor.hospital}</span>
                  </>
                ) : (
                  <span className="text-[10px] text-white/80 font-medium">Ikiganiro cyarangiye</span>
                )}
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-black text-sm tracking-wider flex items-center gap-1.5 ${isLastTwoMinutes ? 'bg-white text-rose-600' : 'bg-white/20 text-white'}`}>
              <Clock size={13} />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${isLastTwoMinutes ? 'bg-white' : 'bg-white/70'}`} style={{ width: `${progressPct}%` }} />
          </div>
          {isLastTwoMinutes && !sessionEnded && (
            <p className="text-[10px] text-white/90 font-bold text-center mt-1.5 animate-pulse">Iminota 2 isigaye!</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-md mx-auto w-full">
        {messages.map((msg, i) => {
          if (msg.from === 'system') {
            return (
              <div key={i} className="flex justify-center">
                <div className="bg-slate-100 text-slate-500 text-[10px] font-medium px-4 py-1.5 rounded-full">{msg.text}</div>
              </div>
            );
          }
          const isUser = msg.from === 'user';
          return (
            <div key={i} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <img src={doctor.image} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0 shadow-sm" />
              )}
              <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                {msg.voiceNote ? (
                  <VoiceNotePlayback note={msg.voiceNote} isOwn={isUser} />
                ) : (
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isUser ? 'bg-teal-500 text-white rounded-br-sm' : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                )}
                {msg.time && <span className="text-[9px] text-slate-400 px-1">{msg.time}</span>}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2">
            <img src={doctor.image} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0 shadow-sm" />
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Muganga arimo gusubiza</span>
              <div className="flex gap-0.5">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {sessionEnded && (
          <div className="bg-gradient-to-br from-teal-50 to-slate-50 border border-teal-200 rounded-2xl p-4 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-teal-500" />
              <h3 className="text-sm font-bold text-teal-800">Incamake y'Ikiganiro</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              {[['Muganga', doctor.name], ['Igihe', 'Iminota 10'], ['Ubutumwa', `${messages.filter(m => m.from === 'user').length} bwoherejwe`], ['Ishyuriwe', '1,000 RWF']].map(([k, v], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className={`font-semibold ${k === 'Ishyuriwe' ? 'text-emerald-600' : ''}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-slate-100 px-4 py-3 pb-28 shrink-0 max-w-md mx-auto w-full">
        {sessionEnded ? (
          <div className="bg-slate-100 rounded-2xl p-3 text-center">
            <p className="text-xs font-bold text-slate-500">Ikiganiro cyarangiye</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <VoiceNoteRecorder onSend={sendVoiceNote} />
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Andika ubutumwa..."
              className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-400 transition-all"
            />
            <button
              onClick={() => send()}
              disabled={!message.trim()}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-md ${
                message.trim() ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-slate-200 text-slate-400'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Phone Call Screen ────────────────────────────────────────────────────────

const CALL_TOTAL_SECONDS = 15 * 60;

function PhoneCallScreen({ doctor, onBack }: { doctor: Doctor; onBack: () => void }) {
  const [callState, setCallState] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [secondsLeft, setSecondsLeft] = useState(CALL_TOTAL_SECONDS);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCallState('active'), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callState !== 'active') return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCallState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const elapsed = CALL_TOTAL_SECONDS - secondsLeft;
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;
  const remainMin = Math.floor(secondsLeft / 60);
  const remainSec = secondsLeft % 60;
  const isLastThreeMinutes = secondsLeft <= 180;
  const progressPct = (elapsed / CALL_TOTAL_SECONDS) * 100;

  const bgClass = callState === 'ended'
    ? 'bg-slate-800'
    : isLastThreeMinutes
    ? 'bg-gradient-to-br from-rose-700 to-rose-900'
    : 'bg-gradient-to-br from-slate-700 to-slate-900';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${bgClass}`}>
      <div className="px-5 pt-14 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
          {callState === 'connecting' ? 'Guhuza...' : callState === 'active' ? 'Hamagara riri mu nzira' : 'Hamagara ryarangiye'}
        </p>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="relative">
          {callState === 'active' && (
            <>
              <div className="absolute rounded-full bg-white/10 animate-ping" style={{ inset: '-20%' }} />
              <div className="absolute rounded-full bg-white/5 animate-ping" style={{ inset: '-40%', animationDelay: '300ms' }} />
            </>
          )}
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-2xl relative z-10"
          />
          {callState === 'active' && (
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-400 border-4 border-slate-800 z-20 flex items-center justify-center">
              <PhoneCall size={12} className="text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-1">{doctor.name}</h2>
          <p className="text-white/60 text-sm">{doctor.specialty}</p>
          <p className="text-white/40 text-xs mt-0.5">{doctor.hospital}</p>
        </div>

        {callState === 'active' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/10">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Igihe Kirangiye</p>
            <p className="text-4xl font-black text-white tabular-nums">
              {String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
            </p>
            <p className={`text-xs font-bold mt-1 ${isLastThreeMinutes ? 'text-rose-300 animate-pulse' : 'text-white/40'}`}>
              Hasigaye {String(remainMin).padStart(2, '0')}:{String(remainSec).padStart(2, '0')}
            </p>
            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden w-40 mx-auto">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${isLastThreeMinutes ? 'bg-rose-400' : 'bg-emerald-400'}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {callState === 'connecting' && (
          <div className="flex items-center gap-2 text-white/60">
            {[0, 200, 400].map(d => (
              <div key={d} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
            <span className="text-sm font-medium ml-1">Guhuza na muganga...</span>
          </div>
        )}

        {callState === 'ended' && (
          <div className="bg-white/10 rounded-2xl p-5 text-center border border-white/10 w-full max-w-xs">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Hamagara Ryarangiye</h3>
            <p className="text-white/60 text-xs mb-3">
              Iminota {String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')} y'ubujyanama
            </p>
            <div className="space-y-1.5 text-xs text-left">
              {[['Muganga', doctor.name, ''], ['Ishyuriwe', '5,000 RWF', 'text-emerald-400 font-bold'], ['Ref', `CALL${Math.floor(Math.random() * 900000 + 100000)}`, 'text-white/60 font-mono text-[10px]']].map(([k, v, cls], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-white/40">{k}</span>
                  <span className={cls || 'text-white/80 font-semibold'}>{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onBack}
              className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-2xl text-sm font-bold transition-all"
            >
              Garuka Ahabanza
            </button>
          </div>
        )}
      </div>

      {callState === 'active' && (
        <div className="px-8 pb-16 flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500' : 'bg-white/15 hover:bg-white/25'}`}>
                {isMuted ? <MicOff size={22} className="text-white" /> : <Mic size={22} className="text-white" />}
              </div>
              <span className="text-[10px] font-bold text-white/60">{isMuted ? 'Ifungurwa' : 'Funga Ijwi'}</span>
            </button>
            <button onClick={() => setIsSpeaker(!isSpeaker)} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSpeaker ? 'bg-teal-500' : 'bg-white/15 hover:bg-white/25'}`}>
                <Wifi size={22} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-white/60">{isSpeaker ? 'Speaker: On' : 'Speaker: Off'}</span>
            </button>
          </div>
          <button
            onClick={() => setCallState('ended')}
            className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/50 transition-all active:scale-90"
          >
            <PhoneOff size={30} className="text-white" />
          </button>
          <p className="text-white/40 text-xs font-medium">Funga Hamagara</p>
        </div>
      )}
    </div>
  );
}

// ─── Video Call Screen ────────────────────────────────────────────────────────

const VIDEO_CALL_TOTAL_SECONDS = 15 * 60;

function VideoCallScreen({ doctor, onBack }: { doctor: Doctor; onBack: () => void }) {
  const [callState, setCallState] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [secondsLeft, setSecondsLeft] = useState(VIDEO_CALL_TOTAL_SECONDS);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCallState('active'), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callState !== 'active') return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCallState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const elapsed = VIDEO_CALL_TOTAL_SECONDS - secondsLeft;
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;
  const remainMin = Math.floor(secondsLeft / 60);
  const remainSec = secondsLeft % 60;
  const isLastThreeMinutes = secondsLeft <= 180;
  const progressPct = (elapsed / VIDEO_CALL_TOTAL_SECONDS) * 100;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${
      callState === 'ended'
        ? 'bg-slate-900'
        : isLastThreeMinutes
        ? 'bg-gradient-to-br from-purple-700 to-purple-900'
        : 'bg-gradient-to-br from-slate-900 to-slate-800'
    }`}>
      {/* Video feed area */}
      <div className="flex-1 relative overflow-hidden bg-black/50 flex items-center justify-center">
        {isVideoOn && callState !== 'ended' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src={doctor.image}
              alt={doctor.name}
              className={`object-cover transition-all duration-700 ${isFullscreen ? 'w-full h-full' : 'w-96 h-96 rounded-3xl'}`}
            />
            <div className="absolute bottom-0 right-0 w-24 h-24 rounded-2xl border-4 border-white/20 bg-black/40 overflow-hidden m-4">
              <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                <Camera size={32} className="text-white/40" />
              </div>
            </div>
          </div>
        )}

        {callState === 'connecting' && (
          <div className="flex flex-col items-center gap-4 z-20">
            <div className="w-24 h-24 rounded-full border-4 border-white/20 border-t-purple-400 animate-spin" />
            <p className="text-white/60 text-sm font-medium">Video ayahitamo...</p>
          </div>
        )}

        {callState === 'ended' && (
          <div className="flex flex-col items-center justify-center gap-4 z-20">
            <CheckCircle size={48} className="text-emerald-400" />
            <h3 className="text-2xl font-black text-white">Hamagara Ryarangiye</h3>
            <p className="text-white/60 text-sm">Ubujyanama bwakunze cyane muri Mperekeza</p>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-6 pt-12 shrink-0">
        <div className="max-w-md mx-auto">
          {/* Timer and progress */}
          {callState === 'active' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-4 py-2 rounded-xl font-black text-lg tracking-wider ${
                  isLastThreeMinutes ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white'
                }`}>
                  {String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
                </div>
                <p className={`text-xs font-bold uppercase tracking-widest ${isLastThreeMinutes ? 'text-purple-300 animate-pulse' : 'text-white/40'}`}>
                  Hasigaye {String(remainMin).padStart(2, '0')}:{String(remainSec).padStart(2, '0')}
                </p>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isLastThreeMinutes ? 'bg-purple-400' : 'bg-emerald-400'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center gap-1.5 transition-all`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMuted ? 'bg-rose-500/80' : 'bg-white/15 hover:bg-white/25'}`}>
                {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
              </div>
              <span className="text-[9px] font-bold text-white/60">{isMuted ? 'Ijwi' : 'Ijwi'}</span>
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isVideoOn ? 'bg-white/15 hover:bg-white/25' : 'bg-rose-500/80'}`}>
                {isVideoOn ? <Camera size={20} className="text-white" /> : <Camera size={20} className="text-white/40" />}
              </div>
              <span className="text-[9px] font-bold text-white/60">Video</span>
            </button>

            {callState === 'active' && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center">
                  <Maximize2 size={20} className="text-white" />
                </div>
                <span className="text-[9px] font-bold text-white/60">Zoom</span>
              </button>
            )}

            {callState === 'active' && (
              <button
                onClick={() => setCallState('ended')}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/50">
                  <PhoneOff size={20} className="text-white" />
                </div>
                <span className="text-[9px] font-bold text-white/60">Funga</span>
              </button>
            )}
          </div>

          {callState === 'ended' && (
            <div className="space-y-3">
              <div className="bg-white/10 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Muganga</span>
                  <span className="text-white font-semibold">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Igihe</span>
                  <span className="text-white font-semibold">{String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Ishyuriwe</span>
                  <span className="text-emerald-400 font-bold">8,000 RWF</span>
                </div>
              </div>
              <button
                onClick={onBack}
                className="w-full bg-purple-500/30 hover:bg-purple-500/50 text-white py-3 rounded-xl text-sm font-bold transition-all"
              >
                Garuka Ahabanza
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 px-4 pt-4 z-30">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-sm font-bold text-white">{doctor.name}</h2>
            <p className="text-[10px] text-white/60">{doctor.specialty} • {doctor.hospital}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>
    </div>
  );
}

// ─── Root Consultation Component ──────────────────────────────────────────────

export default function Consultation() {
  const [mode, setMode] = useState<ConsultMode>('select');
  const [momoConfig, setMomoConfig] = useState<{ amount: string; serviceLabel: string; purpose: MoMoPurpose } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleMomoSuccess = () => {
    if (!momoConfig) return;
    const purpose = momoConfig.purpose;
    setMomoConfig(null);
    if (purpose === 'chat') setMode('doctor-select');
    else if (purpose === 'phone-call') setMode('call-doctor-select');
    else if (purpose === 'video-call') setMode('video-doctor-select');
  };

  if (mode === 'chat-ai') return <AIChatScreen onBack={() => setMode('select')} />;

  if (mode === 'chat-doctor' && selectedDoctor) {
    return <DoctorChatScreen doctor={selectedDoctor} onBack={() => setMode('select')} />;
  }

  if (mode === 'phone-call' && selectedDoctor) {
    return <PhoneCallScreen doctor={selectedDoctor} onBack={() => setMode('select')} />;
  }

  if (mode === 'video-call' && selectedDoctor) {
    return <VideoCallScreen doctor={selectedDoctor} onBack={() => setMode('select')} />;
  }

  if (mode === 'doctor-select') {
    return (
      <DoctorSelectScreen
        title="Hitamo Muganga"
        subtitle="Abaganga bari online ubu"
        accentColor="rose"
        onBack={() => setMode('select')}
        onSelect={d => { setSelectedDoctor(d); setMode('chat-doctor'); }}
      />
    );
  }

  if (mode === 'call-doctor-select') {
    return (
      <DoctorSelectScreen
        title="Hitamo Muganga wo Hamagara"
        subtitle="Hamagara ya iminota 15"
        accentColor="blue"
        onBack={() => setMode('select')}
        onSelect={d => { setSelectedDoctor(d); setMode('phone-call'); }}
      />
    );
  }

  if (mode === 'video-doctor-select') {
    return (
      <DoctorSelectScreen
        title="Hitamo Muganga wo Video"
        subtitle="Hamagara na video ya iminota 15 (HD)"
        accentColor="rose"
        onBack={() => setMode('select')}
        onSelect={d => { setSelectedDoctor(d); setMode('video-call'); }}
      />
    );
  }

  return (
    <>
      <SelectionScreen
        onSelectAI={() => setMode('chat-ai')}
        onSelectDoctor={() => setMomoConfig({ amount: '1,000', serviceLabel: 'Ubujyanama Chat (10 min)', purpose: 'chat' })}
        onSelectCall={() => setMomoConfig({ amount: '5,000', serviceLabel: 'Hamagara na Muganga (15 min)', purpose: 'phone-call' })}
        onSelectVideo={() => setMomoConfig({ amount: '8,000', serviceLabel: 'Hamagara na Video (15 min, HD)', purpose: 'video-call' })}
      />
      {momoConfig && (
        <MoMoModal
          amount={momoConfig.amount}
          serviceLabel={momoConfig.serviceLabel}
          onClose={() => setMomoConfig(null)}
          onSuccess={handleMomoSuccess}
        />
      )}
    </>
  );
}

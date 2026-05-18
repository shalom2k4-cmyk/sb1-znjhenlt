export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

/**
 * SMART LOGIC:
 * - If the user is logging any flow, they are in 'menstruation'.
 * - Otherwise, it calculates the phase based on their typical cycle length.
 */
export function getCyclePhase(
  day: number,
  totalDays: number = 28,
  actualPeriodDays: number = 5
): CyclePhase {
  // 1. DYNAMIC MENSTRUATION:
  // If the user has logged flow for more/fewer days than the "average" 5,
  // the calendar stays/ends on 'menstruation'.
  if (day >= 1 && day <= actualPeriodDays) return 'menstruation';

  const ovulationPeak = totalDays - 14;
  const fertileStart = ovulationPeak - 2;
  const fertileEnd = ovulationPeak + 2;

  // 2. OVULATION
  if (day >= fertileStart && day <= fertileEnd) return 'ovulation';

  // 3. FOLLICULAR (The "Gap")
  if (day < fertileStart) return 'follicular';

  // 4. LUTEAL
  return 'luteal';
}

export const phaseLabels: Record<CyclePhase, string> = {
  menstruation: "Igihe cy'Imihango",
  follicular: 'Igihe cyo Gukira',
  ovulation: 'Igihe cy` uburumbucye',
  luteal: "Igihe nyuma y'Gusama cg amahirwe yo gusama",
};

export const phaseColors: Record<
  CyclePhase,
  { ring: string; bg: string; text: string; badge: string }
> = {
  menstruation: {
    ring: '#F43F5E',
    bg: 'from-rose-50 to-pink-50',
    text: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
  },
  follicular: {
    ring: '#14B8A6',
    bg: 'from-teal-50 to-cyan-50',
    text: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
  },
  ovulation: {
    ring: '#F97316',
    bg: 'from-orange-50 to-amber-50',
    text: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
  },
  luteal: {
    ring: '#8B5CF6',
    bg: 'from-violet-50 to-purple-50',
    text: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
  },
};

export interface DayInsight {
  title: string;
  message: string;
  tips: string[];
  emoji: string;
}

const menstruationInsights: DayInsight[] = [
  {
    title: 'Umunsi wa 1: Imihango',
    message:
      "Imihango yatangiye. Umubiri wawe ukora akazi kenshi cyane uyu munsi kuko uri gusohora akanyangingo (lining) ka nyababyeyi kateganyirizwaga kwakira igi ryamaze guhura n'intangangabo ariko ntiribeho. Ibi bituma imisemburo ya Progesterone na Estrogen igabanuka cyane, bityo rero kwitwararika no kuruhuka ni ngombwa cyane kugira ngo umubiri udasubira inyuma bityo ubashe gukomeza imirimo yawe neza.",
    tips: [
      'Nywa amazi menshi kugirango ugabanye ububabare',
      'Shyira agatambaro gashyushye ku nda yo hasi niba ufite ububabare',
      'Ruhuka neza kandi wirinde imirimo miremire cyane uyu munsi',
    ],
    emoji: '🌸',
  },
  {
    title: 'Umunsi wa 2: Isuku y`imyanya y`ibanga',
    message:
      "Isuku ndetse y'umubiri wawe ni inshingano za buri munsi ariko muri iki gihe by'umwihariko kuko imyanya myibarukiro iba yuguruye kandi ishobora kwandura vuba. Ugomba kwitwararika kuko amaraso ari mu kintu cyatuma mikorobe zororoka vuba cyane bityo bikaba byagutera uburwayi. Hindura pads inshuro 3-4 ku munsi bitewe n'uko uva kugira ngo ugumane itoto kandi ntuze kugira ibibazo mu gihe kizaza.",
    tips: [
      'Hindura pads inshuro 3-4, tamponi cyangwa igitambaro inshuro zirenze 4 ku munsi',
      "Oga buri munsi kugirango wirinde ibyorezo bishobora guterwa n'imyanda",
      'Ambara imyenda iguha amahoro kandi itagufashe cyane ariko itanakurekuye cyane',
    ],
    emoji: '💧',
  },
  {
    title: 'Umunsi wa 3: Kuruhuka no gukira',
    message:
      'Umunsi wa gatatu ni igihe amaraso menshi ava ku bagore benshi. Kubera gutakaza amaraso, umubiri utakaza ubutare (Iron) bwinshi butuma ugira imbaraga. Niba wumva ufite isereri cyangwa unaniwe cyane, ni uko ubutare bwagabanyutse mu mubiri wawe. Fata ibiribwa bikungahaye ku butare kugira ngo umubiri wawe utananirwa cyane bityo ubone imbaraga zo gukora imirimo yawe ya buri munsi nta nkomyi.',
    tips: [
      "Fata ibiribwa birimo iron nk'imboga, inyama cyangwa ibishyimbo",
      'Nywa isupu y inyama cg imboga zisanzwe kugirango ugire imbaraga n intungamubiri',
      'Rya neza kandi wirinde kureya byinshi cyane ngo ufutare ariko urye ibihagije',
    ],
    emoji: '🌿',
  },
  {
    title: 'Umunsi wa 4: kwitegura gusoza imihango',
    message:
      "Amaraso ari gusohoka ni macye ugereranyije n'iminsi yambere. Umubiri wawe utangira kugira imbaraga nshya gusa bidakabije kuko uba ugitakaza ibituma ugira ingufu. Ni igihe cyiza cyo gutangira gutekereza ku minsi iri imbere no kureba uko wakwitwararika ngo utangire icyumweru gishya ufite akanyamuneza.",
    tips: [
      "Tangira gukora imyitozo yoroheje nk'iya kegel kugira ngo ukomeze imikaya yawe",
    ],
    emoji: '✨',
  },
  {
    title: "Umunsi wa 5: Iherezo ry'imihanga yawe",
    message:
      "Imihango irarangira uyu munsi ku bagore benshi bafite ukwezi gushyitse. Umubiri wawe umera neza kandi ukagarura akanyamuneza. Wishimire inzira wateye mu rwego rw'ubuzima kuko gusoza iki gihe neza ari intambwe ikomeye mu kubumbatira amagara yawe. Komeza isuku uyu munsi kuko ari bwo umubiri uba uri gusoza inzira yawo.",
    tips: [
      'Oga neza kugirango ugere neza mu gihe gishya cyo gukira',
      'soma ibitabo kandi ukore ibigushimisha uyu munsi kuko ufite imbaraga',
      'Rya ibiryo bigushimisha kandi bikubaka umubiri',
    ],
    emoji: '🌺',
  },
];

const follicularInsights: DayInsight[] = [
  {
    title: 'Igihe cyo Gukira',
    message:
      "Umubiri wawe ufite imbaraga nyinshi cyane uyu munsi kuko Estrogen iriyongera mu maraso yawe. Ibi bituma ubwonko bwawe bukora vuba, ukagira imbaraga mu mitekerereze, kandi ukumva ufite akanyamuneza kadasanzwe mu bandi bantu. Iyi ni iminsi myiza yo gukora imirimo myinshi kuko uba ufite imbaraga nyinshi zo guhangana n'imbogamizi zose wahura nazo mu buzima bwawe bwa buri munsi.",
    tips: [
      'Ni igihe cyiza cyo gutangira imishinga mishya cyangwa akazi katoroshye',
      'Kora imyitozo irimo imbaraga - umubiri wawe uriteguye cyane',
      'Fata ibiribwa birimo proteyini nyinshi kugira ngo wubake imikaya yawe',
    ],
    emoji: '🌱',
  },
];

const ovulationInsights: DayInsight[] = [
  {
    title: 'Ubushobozi bwo Gusama buri Hejuru',
    message:
      "Uri mu minsi y'uburumbuke bwinshi cyane. Igi ryamaze gusohoka mu ruganda rwaryo (ovary) rurimo gutegereza guhura n'intangangabo. Niba ushaka gusama iki ni cyo gihe cyo kugerageza ariko niba udashaka gusama uyu munsi urakomeye cyane kuko amahirwe yo gusama ari hafi 100%. Ni ngombwa kumenya ibi kugira ngo ufate imyanzuro ikwiye ku buzima bwawe bw'imyororokere.",
    tips: [
      "Urashobora kwiyumva ukonje cyane mu gifu - ni ikimenyetso cy'ovulation",
      'Urumva ushaka gukora imibonano mpuzabitsina kurusha indi minsi yose',
      'Niba ushaka kwirinda gusama, koresha condom buri gihe nta gushidikanya',
    ],
    emoji: '🌟',
  },
  {
    title: "Ikimenyetso cy'Ovulation(uburumbuke)",
    message:
      "Igitsina gitangira kugira amazi cg amatembabuzi cg ububobere bufashe bukereye (nko mu nkeri y'igi) bukwereka ko igi ryasohotse cyangwa riri hafi gusohoka vuba cyane. Niba ushaka gusama iki ni cyo gihe cyo kugerageza cyangwa niba udashaka gusama itwararike uyu munsi kuko ubu amatembabuzi arimo koroshya inzira y'intangangabo ngo igere ku igi ryawe vuba cyane.",
    tips: [
      "Kora test y'ovulation niba ushaka kumenya neza aho ugeze",
      'kora mu gitsinda n`intoki zisukuye urebe ko ugutoha gufashe uburyo bumeze',
      'Niba amatembabuzi ahumura nabi, baza muganga kuko ushobora kuba ufite infection',
    ],
    emoji: '💫',
  },
];

const lutealInsights: DayInsight[] = [
  {
    title: 'Imitekerereze yahindutse',
    message:
      "Uyu munsi Progesterone iriyongera cyane mu gihe cya luteal ugezemo. Ibi bishobora gutuma wiyumva ufite umunaniro, guhindagurika kw'imitekerereze, cyangwa kumva ufite agahinda bityo ntumenye impamvu. Humura kuko ni imisemburo iri kubikora, ntugatekereze ko ufite ikibazo cyo mu mutwe. Urakomeye kandi ibi biri gufasha umubiri wawe kwitegura indi nzira igiye guza vuba.",
    tips: [
      "Niba utangiye kwishyira mu nkeke - bwira inshuti yawe uganire n'abantu bagusetsa",
      "Kora imyitozo nka yoga yuruhura umubiri n'intekerezo zawe",
      'Irinde kafeine nyinshi kuko bishobora kongera guhangayika gukabije',
    ],
    emoji: '🧘',
  },
  {
    title: 'PMS n; ibyiyumviro bidasanzwe',
    message:
      "Inshuro nyinshi umuntu agenda agira PMS (Pre-Menstrual Syndrome) mbere y'uko imihango itangira. Wumva amabele abyimbye cyangwa akurya, umutwe, ndetse n'uburakari bwa hato na hato. Ni ngombwa kumenya ibi bimenyetso kugira ngo utaza guhangana n'abantu bitari ngombwa kuko uba ufite impinduka mu mubiri wawe zitoroshye na gato.",
    tips: [
      "Andika mu gitabo c'ibyishimo ibimenyetso byawe buri munsi ngo ubimenye",
      "Fata magnesium (nk'imineke) niba ufite ububabare bw'amabele cyangwa umutwe",
      'Rya neza kandi wirinde ibiribwa birimo isukari nyinshi cyane',
    ],
    emoji: '💙',
  },
];

// NEW: LONG GAP CONTENT FOR IRREGULAR CYCLES
const longCycleGapInsights: DayInsight[] = [
  {
    title: "Guhindagurika k'ukwezi",
    message:
      "Kubera ko ukwezi kwawe ari kure, umubiri wawe uba uri mu cyitwa 'Extended Follicular Phase'. Ibi bivuze ko imisemburo ya ya Estrogen izamuka buhoro buhoro ugereranyije n'abandi bafite iminsi 28. Ibi ntibivuze ko urwaye cyangwa ufite ikibazo, ahubwo ni umuvuduko w'umubiri wawe uba ari uwo uyu munsi. Komeza ube maso kandi witwararike kuko uburumbuke bwawe buzaza nyuma y'igihe abandi bibwira ko bwapfuye.",
    tips: [
      'Kurikirana amatembabuzi yawe buri munsi',
      'Rya imbuto nyinshi cyane uyu munsi',
      'Komeza imirimo yawe ufite imbaraga',
    ],
    emoji: '⏳',
  },
];

export const didYouKnowFacts = [
  {
    fact: 'Gukoresha agakingirizo neza ni yo nzira yingenzi kandi yizewe ifasha kwirinda kwandura virusi itera SIDA nizindi ndwara zandurira mu mibonano mpuzabitsina bityo ni ngombwa gusuzuma itariki kagezweho mbere yo kugakoresha no kureba niba katarangiritse kugira ngo kabe kacyujuje ubuziranenge Mu rwego rwo kwirinda ko gacika cyangwa kanyerera ugomba kumenya uko kambarwa neza guhera ku mutwe wigitsina kugeza hasi kandi ukirinda gukoresha amavuta ashingiye kuri peteroli nkamavuta yo kwisiga asanzwe kuko yangiza raba latex yagakingirizo ahubwo ugakoresha imiti yagenewe koroshya imibonano ishingiye ku amazi Ni byiza kandi gukoresha agakingirizo gashya buri nshuro ugiye gukora imibonano mpuzabitsina ukagakuramo neza ukirinda ko amatembabuzi ameneka maze ukajugunya kure yaho abantu nibinyabuzima bishobora kugasanga mu rwego rwo gukomeza kubumbatira ubuzima bwawe n`ubw` abo ukunda',
    category: 'SIDA',
    icon: 'shield',
  },
  {
    fact: 'Abagore bafite uburenganzira busesuye bwo gufata ibyemezo ku buzima bwabo bwite kuko ari ihame rishingiye ku burenganzira bwa muntu ryo kugira ubwigenge ku mubiri wabo no guhitamo imibereho ibabereye bityo ni ngombwa ko buri mugore ahabwa amahirwe angana yo kugera kuri serivisi z’ubuzima no gufata imyanzuro ku buzima bw’imyororokere nta gahato cyangwa akato kuko ubu burenganzira ari inkingi ya mwamba mu gutuma umugore agira agaciro yiteza imbere kandi akagira uruhare rugaragara mu muryango mugari bitabaye ngombwa ko hagira undi muntu umuvogerera amahitamo yubaka ejo heza hazaza h’ubuzima bwe n’ubw’abamukomokaho bose mu mudendezo no mu bwisanzure butagira imipaka imukumira mu nshingano ze nkumuntu ufite ubwenge n’ubushobozi bwo kwihitiramo icyiza',
    category: 'Uburenganzira',
    icon: 'heart',
  },
  {
    fact: "PrEP ni umuti wizewe ukoreshwa n’abantu batanduye virusi itera SIDA kugira ngo bayirinde bityo ni ngombwa gusura muganga akagupima maze akaguha amabwiriza yuko uwufata buri munsi kandi kugira ngo agukingire mu buryo bwuzuye kuko kwegera inzobere mu buzima ari yo nzira yonyine yo kumenya niba uyu umuti ugukwiriye no kumenya uko uwukoresha neza ngo ubungunbe amagara yawe kugira ngo ubaho mu mutekano usesuye kandi uzira amakemwa imbere y'icyorezo cya SIDA gikomeje kwibasira isi bityo PrEP ikaba ari intwaro ikomeye yo kwirinda.",
    category: 'SIDA',
    icon: 'pill',
  },
  {
    fact: 'Kwisuzumisha virusi itera SIDA ni intambwe ikomeye igufasha kumenya amakuru nyayo ku buzima bwawe kugira ngo ubashe kubungabunga amagara yawe neza kandi ni serivisi itangirwa ubuntu mu mavuriro menshi mu Rwanda bityo rero ushobora kugana ikigo cyubuvuzi cyegeranye nawe bakagupima mu uburyo bwizewe kandi bwibanga hagamijwe kugufasha gufata imyanzuro ikwiye nkuburyo bwo kwirinda cyangwa gutangira imiti hakiri kare ngo ukomeze kubaho wishimye kandi ukorera igihugu kuko kumenya uko uhagaze ariyo nkingi yo gupanga ejo haza hazaza hanyu muri rusange nta gushidikanya.',
    category: 'SIDA',
    icon: 'stethoscope',
  },
  {
    fact: 'Kugira isuku nziza mu gihe cy imihango ni ingenzi cyane kuko bifasha umubiri guhorana itoto kandi bikagabanya amahirwe yo kwandura indwara zitandukanye cyangwa ibyorezo biterwa n imyanda bityo ni ngombwa gukoresha ibikoresho byisuku byizewe no gukaraba kenshi kugira ngo ubungabunge ubuzima bwawe n amagara yawe muri rusange mu mudendezo usesuye kandi wirinde impumuro mbi ishobora kukubangamira mu bandi.',
    category: 'Isuku',
    icon: 'droplets',
  },
  {
    fact: 'Kunywa inzoga nyinshi bigabanya ubushobozi bwo gufata ibyemezo bizira amakemwa bigatuma ukora imibonano mpuzabitsina idakingiye bityo bikongera amahirwe yo kwandura virusi ya HPV n’izindi ndwara zandurira mu mibonano mpuzabitsina bityo rero ni byiza kugabanya inzoga kugira ngo ubashe kugenzura amahitamo yawe no kubungabunga amagara yawe mu buryo bwizewe kandi butagushyira mu kaga’indwara zishobora kwirindwa mu buryo bworoshye ukoresheje ubushishozi mu buzima bwawe bwa buri munsi ubeho uzira amakemwa.',
    category: 'Isuku',
    icon: 'alert',
  },
  {
    fact: 'Buri mugore wese akwiye kwisuzumisha kanseri yinkanda byibura rimwe mu myaka itatu kuko ari uburyo bwiza bwo kuvumbura hakiri kare ibimenyetso byose byatuma urwara bityo ni ngombwa kugana ivuriro rikwegereye kugira ngo uhabwe serivisi zo gusuzumwa no guhabwa amakuru ayizewe agufasha kubungabunga ubuzima bwawe no kwirinda ubu burwayi mu buryo buhoraho kandi bwizewe mu rwego rwo kurengera amagara yawe no kwitegura ejo heza hazaza hazira indwara zitamenyekana.',
    category: 'Ubuzima',
    icon: 'heart',
  },
  {
    fact: 'Kugira ubusabane bwiza n’inshuti mufitanye icyizere ni inkingi ikomeye ifasha mu gusangira amakuru nyayo ku buzima bw’imyororokere bityo rero wirinde kwigirira icyizere gike kuko kuganirana ubwisanzure bituma ufata ibyemezo bikwiye bishingiye ku bumenyi uvomye ku bandi,kand bikakurinda guheranwa n’ipfunwe rishobora kukubuza kugera kuri serivisi z’ubuzima zikwiye kugira ngo ubashe kubungabunga amagara yawe n’umutekano w’igitsina cyawe mu buryo buhamye kandi buzira amakemwa kuko ubumenyi ari mbaraga zo kwirinda.',
    category: 'Ubuzima',
    icon: 'users',
  },
];

export function getDayInsight(
  day: number,
  totalDays: number = 28,
  actualPeriodDays: number = 5
): DayInsight {
  const phase = getCyclePhase(day, totalDays, actualPeriodDays);
  const ovulationPeak = totalDays - 14;
  const fertileStart = ovulationPeak - 2;

  // 1. Menstruation Insights
  if (phase === 'menstruation') {
    // If the actual period is longer than 5 days, we loop the insights for those extra days
    return menstruationInsights[(day - 1) % menstruationInsights.length];
  }

  // 2. Long Cycle Gap Logic (Advanced Mode)
  if (totalDays > 30 && day > actualPeriodDays && day < fertileStart) {
    return longCycleGapInsights[day % longCycleGapInsights.length];
  }

  // 3. Follicular
  if (phase === 'follicular') {
    return follicularInsights[0];
  }

  // 4. Ovulation
  if (phase === 'ovulation') {
    const base = ovulationInsights[day % ovulationInsights.length];
    if (totalDays !== 28) {
      return {
        ...base,
        title: 'Uburumbuke budasanzwe',
        message:
          'Kubera ko ukwezi kwawe guhinduka, uyu munsi nibwo uburumbuke bwawe bugezeho. Witwararike cyane niba udashaka gusama uyu munsi.',
      };
    }
    return base;
  }

  // 5. Luteal (PMS Timing)
  const daysUntilNextPeriod = totalDays - day;
  if (daysUntilNextPeriod <= 4) {
    return lutealInsights[1];
  }
  return lutealInsights[0];
}

export function getDidYouKnow(day: number) {
  return didYouKnowFacts[day % didYouKnowFacts.length];
}
/**
 * PREDICTION LOGIC
 * Calculates if menses are coming soon or are late.
 */
export function getMensesPrediction(
  currentDay: number,
  averageCycle: number = 28
): { message: string; status: 'normal' | 'warning' | 'imminent' } {
  const daysUntil = averageCycle - currentDay;

  if (daysUntil > 2) {
    return {
      message: `Hasigaye iminsi ${daysUntil} ngo imihango yawe itangira.`,
      status: 'normal',
    };
  }

  if (daysUntil <= 2 && daysUntil > 0) {
    return {
      message:
        "Imihango yawe iri hafi kutangira (mu minsi 2). Ibuka kwitwaza ibikoresho by'isuku aho ugiye hose.",
      status: 'imminent',
    };
  }

  if (daysUntil === 0) {
    return {
      message:
        'Uyu munsi niyo tariki iteganyijwe ko imihango yawe itangira. Genzura niba hari impinduka wumva mu mubiri.',
      status: 'imminent',
    };
  }

  const daysLate = Math.abs(daysUntil);
  return {
    message: `Imihango yawe yatinzeho iminsi ${daysLate}. Niba wari wakoze imibonano mpuzabitsina idakingiye, wakora isuzuma ryo gusama (Pregnancy test).`,
    status: 'warning',
  };
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'hiv' | 'hygiene' | 'future';
  readTime: number;
  image: string;
  videoUrl?: string;
  audioUrl?: string;
}

export const insightCategories = {
  hiv: { label: 'Kwirinda SIDA', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'shield' },
  hygiene: { label: 'Isuku mu Mihango', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', icon: 'droplets' },
  future: { label: 'Ibyo Kwitega Ejo', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'star' },
};

export const insights: Insight[] = [
  {
    id: '1',
    title: 'Condom: Inzira Nziza yo Kwirinda SIDA',
    summary: 'Condom ni inzira yonyine ikingira SIDA na STIs mu gihe cyo gukora imibonano mpuzabitsina. Menya uko zikoresha neza.',
    content: 'Iyi ni inyandiko igufasha gusobanukirwa neza akamaro ka Kondomu mu kurengera ubuzima bwawe n\'ubw\'uwo mukundana. Twazanditse mu buryo bworoheje kandi bugaragaza ukuri ku buzima bw\'imyororokere mu Rwanda.\n\n🩺 Icyitonderwa ku Bagore n\'Abakobwa: Kurinda Ubuzima Bwawe\n\n1. Intwaro Yonyine Ifatika\nMuri ubu buzima, hari uburyo bwinshi bwo kuboneza urubyaro (nka pilula cyangwa agashinge), ariko ugomba kumenya ko Kondomu ari yo nzira yonyine ishobora kugukingira icyarimwe:\n• Kwandura virusi itera SIDA.\n• Indwara zandurira mu mibonano mpuzabitsina (STIs) nka Mburugu, Imitezi, na Chlamydia.\n• Gusama inda utateganyije.\n\n2. Kwizera n\'Inshingano\nAbantu benshi bibwira ko gukoresha kondomu ari ukubera ko batizerana, ariko siko bimeze. Kuzikoresha n\'uwo mukundana ni ikimenyetso cy\'urukundo nyakuri n\'ubwenge, kuko biba bivuze ko mwembi mushaka kurinda ejo hazaza hanyu.\n\n3. Amabwiriza y\'ingenzi yo kuzikoresha neza:\n• Reba itariki (Expiry Date): Ntukikoreshe kondomu yarengeje igihe.\n• Yibike neza: Irinde kuyibika ahantu hashyushye cyane.\n• Koresha nshya buri nshuro: Ntukongere gukoresha kondomu imwe inshuro ebyiri.\n• Fungura witonze: Ntukoreshe amenyo cyangwa inzara uyifungura.\n\n4. Inama ku Bagore\nGira ijambo ku buzima bwawe. Gukoresha kondomu ni uburenganzira bwawe kandi ni inshingano yawe. Ntukagire isoni zo kuyisaba uwo muri kumwe, kuko ubuzima bwawe ni wowe bwambere bufitiye akamaro.',
    category: 'hiv',
    readTime: 3,
    image: 'https://images.pexels.com/photos/28743213/pexels-photo-28743213.jpeg',
    videoUrl: 'https://youtu.be/WQD232gEC-U?si=UHzuO5OQ_RY4k8N2',
    audioUrl: 'https://example.com/audio/condom-guide-rw.mp3',
  },
  {
    id: '2',
    title: 'PrEP: Imiti yo Kwirinda SIDA',
    summary: 'PrEP (Pre-Exposure Prophylaxis) ni imiti ishobora gukingira SIDA iyo ifashwemo mu buryo muganga yabikubwiyemo. Baza umuganga wawe agusobanurire.',
    content: 'PrEP ni imiti ishobora gukingira SIDA ku bantu bari mu byago byo kwandura.',
    category: 'hiv',
    readTime: 4,
    image: 'https://images.pexels.com/photos/11361813/pexels-photo-11361813.jpeg',
    videoUrl: 'https://youtu.be/MzroIDry9l0?si=pSC5vaX_2qYq97jz',
    audioUrl: 'https://example.com/audio/prep-guide-rw.mp3',
  },
  {
    id: '3',
    title: 'Gusuzuma agakoko gatera SIDA',
    summary: 'Isuzuma ry\'agakoko gatera SIDA ni inyungu kandi ni buntu mu bitaro byinshi mu Rwanda. Isuzumwe buri mwaka cg mu gihe wumva utiyizeye kuko kubimenya hakiri kare ni ngombwa mu rwego rwo kubungabunga ubuzima',
    content: 'Kwisuzumisha SIDA ni intambwe ya mbere n\'ingenzi mu kurengera ubuzima bwawe n\'ejo hazaza hawe. Kumenya uko uhagaze biguha amahoro yo mu mutima n\'ubushobozi bwo gufata ibyemezo bikwiye, kuko ubumenyi ari bwo bwirinzi bukomeye.\n\n🩺 Icyo ugomba kumenya kuri gahunda yo Kwisuzumisha SIDA:\n\n1. Kumenya Amakuru Kare\nKwisuzumisha SIDA bigufasha kumenya amakuru y\'ukuri ku buzima bwawe. Kumenya ko ufite virusi itera SIDA hakiri kare bituma utangira kwitwararika no gufata imiti ituma utarwara SIDA ubwayo, bityo ukomeze kugira umubiri ukomeye kandi ushoboye gukora.\n\n2. Imiti ya ARV n\'Ubuzima Bushya\nNiba ugiye kwisuzumisha SIDA bigasanga ufite virusi, ntucike intege. Imiti igabanya ubukana bwa virusi (ARVs) ishobora kugufasha kubaho ubuzima bwiza, bukurambye, kandi bufite intego nk\'abandi bose. Iyi miti ituma virusi igabanyuka mu mubiri ku buryo idashobora kwanduza uwo mukundana cyangwa umwana wawe.\n\n3. Kurinda Abandi n\'Umuryango\nNiba ugiye kwisuzumisha SIDA ugasanga uri muzima, bigufasha kumenya ingamba nshya wagombye gufata kugira ngo ukomeze kwirinda. Niba kandi uri umugore utwite, kwisuzumisha bigufasha gufata imiti irinda umwana wawe kuzavukana virusi (PMTCT).\n\n4. Kwisuzumisha ni Ubuntu kandi ni Ibanga\nMuri kliniki n\'ibitaro hafi ya byose mu Rwanda, kwisuzumisha SIDA rirakorwa mu buryo bw\'ibanga rikomeye kandi ni ubuntu. Ntakwiye kugira ipfunwe kuko kumenya ukuri ari rwo rufunguzo rwo kubaho neza.\n\n✨ Inama y\'ingenzi:\nGira akamenyero ko kwisuzumisha SIDA byibuze rimwe mu mwaka, cyangwa igihe cyose ugiye gutangira umubano mushya. Kumenya amakuru yawe ni bwo bwirinzi bukomeye ufite kuri ejo hawe hazaza.',
    category: 'hiv',
    readTime: 3,
    image: 'https://images.pexels.com/photos/5721386/pexels-photo-5721386.jpeg',
    videoUrl: 'https://youtu.be/ewowBlXIsL8?si=nR7jhQl11RWIHZzM',
    audioUrl: 'https://example.com/audio/hiv-testing-rw.mp3',
  },
  {
    id: '4',
    title: 'Isuku y\'Umubiri mu Gihe cy\'Imihango',
    summary: 'Isuku nziza mu gihe cy\'imihango ni inshingano zawe. Hindura ibikoresho by`isuku yawe yo mu mihango inshuro 3-4 ku munsi.',
    content: 'Mu gihe cy\'imihango, isuku y\'umubiri ni ngombwa cyane. Hindura tamponi cyangwa igitambaro inshuro zirenze 4 ku munsi. Oga buri munsi kugirango wirinde ibyorezo. Niba ukoresha tamponi',
    category: 'hygiene',
    readTime: 4,
    image: 'https://kasha-assets-production.s3.amazonaws.com/rw/uploads/2017/11/DSC_7671-3.jpg',
    videoUrl: 'https://youtu.be/2lSR8iWEF54?si=g5dOXDwu9fXNtQ-v',
    audioUrl: 'https://example.com/audio/period-hygiene-rw.mp3',
  },
  {
    id: '5',
    title: 'Uburyo bwo Kugabanya Ububabare bw\'Imihango',
    summary: 'Ububabare bw\'imihango ni ibisanzwe. Hari uburyo bwinshi bwiza bwo kubugabanya nta miti.',
    content: 'Ububabare bw\'imihango (dysmenorrhea) ni ibisanzwe ku abagore benshi. Uburyo bwiza bwo kubugabanya: shyira agatambaro gashyushye ku nda, kora imyitozo yoroheje, nywa amazi menshi, fata iminsi yo kuruhuka.',
    category: 'hygiene',
    readTime: 5,
    image: 'https://www.newtimes.co.rw/thenewtimes/uploads/images/2026/01/19/96149.jpg',
    videoUrl: 'https://youtu.be/2H2j3tJj6kY?si=26QTU-CtUdtv0po0',
    audioUrl: 'https://example.com/audio/period-pain-relief-rw.mp3',
  },
  {
    id: '6',
    title: 'Sanitary Pads cyangwa Tamponi: Ni Ikihe Gikwiye?',
    summary: 'Ihitamo riri mu maboko yawe. Menya uburyo bwo gukoresha buri kimwe neza kugirango wirinde ibyorezo.',
    content: 'Sanitary pads ni ibikoresho byo hanze biritwa ku mwambaro. Ni byoroshye gukoresha. Tamponi ni ibikoresho bishyirwa mu nzira y\'amaraso. Ni byiza niba ushaka kurakara. Uburyo bwose ni bwiza niba bufatwemo neza.',
    category: 'hygiene',
    readTime: 4,
    image: 'https://images.pexels.com/photos/5938370/pexels-photo-5938370.jpeg',
    videoUrl: 'https://www.youtube.com/embed/fRdIkM6xQME',
    audioUrl: 'https://example.com/audio/menstrual-products-rw.mp3',
  },
  {
    id: '7',
    title: 'Gusama: Ibyo Ugomba Kumenya',
    summary: 'Gusama ni inzira nziza cyane. Menya igihe gikwiye no gutera ingamba nziza.',
    content: 'Gusama ni inzira nziza kandi birashoboka niba uri mu gihe cyo gusama (umunsi 12-16). Niba ushaka gusama, baza umuganga wawe inama. Niba ushaka kwirinda gusama, koresha condom cyangwa imiti y\'uburyo bw\'uko batazasama.',
    category: 'future',
    readTime: 5,
    image: 'https://rbc.gov.rw/marburg/wp-content/uploads/2024/01/49433681947_7ec7ecaeef_c.jpg',
    videoUrl: 'https://www.youtube.com/embed/SZ7ljrvZr9U',
    audioUrl: 'https://example.com/audio/pregnancy-info-rw.mp3',
  },
  {
    id: '8',
    title: 'Cervical Cancer: kanseri y`inkondo y`umura',
    summary: 'kanseri y\'inkondo y\'umura ishobora kuvurwa igakira isuzumwe ikaboneka kare, Isuzumishe buri myaka 3 muri kliniki ikuri hafi',
    content: "Cancer y'inkondo y'umura ni indwara ishobora gukumirwa bishobotse iyo isuzumwe hakiri kare, kuko kumenya uko uhagaze kare ari ryo shingiro ryo kuyitsinda. Urukingo rwa HPV ni intwaro ikomeye mu kurinda abana n'abangavu bari hagati y'imyaka 9 na 26, rukaba rububakira ubwirinzi bukomeye butuma badahura n'ingaruka z'uwo muryango w'indwara mu gihe kizaza. By'umwihariko, isuzuma rya 'Pap smear' ni ryo ryafasha umugore wese gusobanukirwa imiterere y'uturemagingo twe, bityo niba hari ikibazo kikaba cyavurwa kare kitararenga igaruriro. Kwisuzumisha kare no gufata ingamba z'ubwirinzi ni ryo banga ryo kurinda ubuzima bw'umugore no guharanira ejo hazaza heza",
    category: 'future',
    readTime: 5,
    image: 'https://www.clintonhealthaccess.org/wp-content/uploads/2024/08/DL1B5770.jpg',
    videoUrl: 'https://www.youtube.com/embed/vHD3rNZLkxU',
    audioUrl: 'https://example.com/audio/cervical-cancer-rw.mp3',
  },
  {
    id: '9',
    title: 'Ibimenyetso by\'Ovulation: Kumenya Imiterere y\'Umubiri wawe',
    summary: 'igihe cy`uburumbuke ni igihe gikomeye mu nzira y\'abagore. Menya ibimenyetso birimo ihinduka ry`imiterere y`amazi aba ari mu gitsina igihe cy`uburumbuke ndetse n`ubushyuhe cg umuriro wiyumvamo mu bihe nk`ibi. ',
    content: 'Ibimenyetso by\'ovulation birimo: amazuru y\'umubiri afata ibara ryera no gutetera, ubushyuhe bw\'umubiri bwiyongera gato, ububabare gato mu mfyino y\'inkingi, no kwiyumva ufite inshuti z\'imibonano. Kumenya ibi bifasha gufata ibyemezo ku buzima.',
    category: 'future',
    readTime: 4,
    image: 'https://www.med.unc.edu/timetoconceive/wp-content/uploads/sites/759/2018/06/type4cervicalmucus.jpg',
    videoUrl: 'https://www.youtube.com/embed/C-MX_2d4pIk',
    audioUrl: 'https://example.com/audio/ovulation-signs-rw.mp3',
  },
];

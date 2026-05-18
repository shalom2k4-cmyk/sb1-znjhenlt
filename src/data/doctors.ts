export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  district: string;
  hospital: string;
  available: boolean;
  rating: number;
  consultations: number;
  languages: string[];
  image: string;
  bio: string;
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Kristi +UN',
    specialty: 'Inzobere mu Nzira z\'Abagore',
    location: 'Gasabo, Masoro',
    district: 'Gasabo',
    hospital: 'Masoro Health Center',
    available: true,
    rating: 4.9,
    consultations: 342,
    languages: ['kiswahili', 'Igifaransa', 'Icyongereza'],
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
    bio: 'Inzobere mu nzira z\'abagore ifite uburambe bw\'imyaka 12 mu kuvura abarwayi b\'abagore n\'indwara za STI/HIV.',
  },
  {
    id: '2',
    name: 'Dr. Aline Gashumba',
    specialty: 'Ubuzima bw\'Abagore n\'Abana',
    location: 'Kicukiro, Gatenga',
    district: 'Kicukiro',
    hospital: 'Gatenga Health Center',
    available: true,
    rating: 4.8,
    consultations: 218,
    languages: ['Kinyarwanda', 'Icyongereza'],
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
    bio: 'Inzobere mu gukora ibibazo by\'ubuzima bw\'abagore no gufasha abagore gusobanukirwa imibiri yabo.',
  },
  {
    id: '3',
    name: 'Dr. FistonISHIMWE',
    specialty: 'HIV/AIDS n\'Indwara za STI',
    location: 'Nyarugenge, Nyamirambo',
    district: 'Nyarugenge',
    hospital: 'CHUK - Kliniki y\'Indwara',
    available: false,
    rating: 5.00,
    consultations: 1000,
    languages: ['Kinyarwanda', 'Igifaransa'],
    image: 'https://images.pexels.com/photos/32254662/pexels-photo-32254662.jpeg',
    bio: 'Inzobere mu gukumira no kuvura HIV/AIDS na STIs. Afite uburambe mu gutanga inama z\'ubuzima.',
  },
  {
    id: '4',
    name: 'Dr. Consolée Mukamana',
    specialty: 'Ubuzima bw\'Imitsi n\'Indwara z\'Abagore',
    location: 'Bugesera, Rilima',
    district: 'Bugesera',
    hospital: 'Rilima District Hospital',
    available: true,
    rating: 4.6,
    consultations: 156,
    languages: ['Kinyarwanda'],
    image: 'https://images.pexels.com/photos/19131219/pexels-photo-19131219.jpeg',
    bio: 'Muganga w\'abagore ufite impuhwe cyane ku bari mu ntara. Afasha abagore batuye mu cyaro gufata ibyemezo by\'ubuzima bwiza.',
  },
  {
    id: '5',
    name: 'Dr. Vestine Mukamana',
    specialty: 'Inzira z\'Abagore n\'Gutwita',
    location: 'Musanze, Kinigi',
    district: 'Musanze',
    hospital: 'Kinigi Health Center',
    available: true,
    rating: 4.8,
    consultations: 277,
    languages: ['Kinyarwanda', 'Icyongereza'],
    image: 'https://images.pexels.com/photos/5234473/pexels-photo-5234473.jpeg',
    bio: 'Muganga w\'abagore ufite uburambe mu gufasha abagore batwite no gutanga inama ku bibazo by\'inzira z\'abagore.',
  },
];

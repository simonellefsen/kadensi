import type { SegmentType } from './program'

export type Language = 'da'

const da = {
  appName: 'Kadens',
  tagline: 'Find din kadens',
  // Share
  shareTitle: 'Kadens',
  shareText: 'Kadens hjælper dig i gang med at løbe — fra 0 til 5 km. Prøv den!',
  shareCopied: 'Link kopieret!',
  shareFailed: 'Kunne ikke dele.',
  // Navigation
  navHome: 'Plan',
  navAdvice: 'Råd',
  navHistory: 'Historik',
  navSettings: 'Indstillinger',
  // Home
  nextSession: 'Næste træning',
  week: 'Uge',
  session: 'Træning',
  start: 'Start',
  minutes: 'min',
  totalTime: 'Samlet tid',
  runTime: 'Løbetid',
  progress: 'Fremskridt',
  programDone: 'Du har gennemført hele programmet! 🎉',
  milestone3km: '3 km',
  milestone5km: '5 km',
  completedBadge: 'Gennemført',
  // Segments
  segment: {
    warmup: 'Opvarmning',
    run: 'LØB',
    walk: 'GÅ',
    cooldown: 'Nedkøling',
  } satisfies Record<SegmentType, string>,
  // Session screen
  next: 'Næste',
  pause: 'Pause',
  resume: 'Fortsæt',
  skip: 'Spring over',
  endSession: 'Afslut',
  holdHint: 'Hold inde…',
  holdNote: 'Hold en knap inde i et øjeblik — så aktiverer den ikke ved uheld i lommen.',
  finished: 'Godt løbet!',
  finishedBody: 'Træningen er gennemført og gemt.',
  backToPlan: 'Tilbage til planen',
  confirmEnd: 'Vil du afslutte træningen uden at gemme den som gennemført?',
  resumePrompt: 'Du har en træning i gang. Vil du fortsætte den?',
  resumeYes: 'Fortsæt træning',
  resumeNo: 'Kassér',
  silentHint: 'Lyd kræver at ringetone-kontakten ikke står på lydløs',
  // Speech cues
  speech: {
    warmup: 'Opvarmning. Gå roligt.',
    run: 'Løb nu!',
    walk: 'Gå nu.',
    cooldown: 'Nedkøling. Gå roligt.',
    halfway: 'Halvvejs!',
    lastInterval: 'Sidste interval!',
    done: 'Flot klaret! Træningen er slut.',
  },
  // Advice
  adviceTitle: 'Råd om kost & væske',
  adviceIntro:
    'Gode vaner omkring mad og væske gør løbeturen lettere og restitutionen bedre. Det her er generelle råd — prøv dig frem, for alle maver er forskellige.',
  adviceSections: [
    {
      icon: '🥣',
      title: 'Før løbeturen',
      items: [
        'Spis et let måltid 1½–3 timer før — mest kulhydrater med lidt protein, fx havregrød, fuldkornsbrød eller en banan.',
        'Undgå meget fed, stegt eller fiberrig mad lige før — det kan give ondt i maven.',
        'Har du kun 30–60 min? Tag en lille snack: en banan, en håndfuld rosiner eller en dadel.',
        'Løber du om morgenen, kan en kort tur sagtens klares på tom mave — mærk efter hvad der passer dig.',
      ],
    },
    {
      icon: '💧',
      title: 'Væske',
      items: [
        'Drik 300–500 ml vand 1–2 timer før, så du starter veludhvilet og uden at skvulpe.',
        'På ture under ca. 45–60 min er vand rigeligt — drik efter tørst, gerne små slurke.',
        'Har du svedt meget, så tænk lidt salt ind bagefter (fx via maden) for at genoprette balancen.',
      ],
    },
    {
      icon: '🍽️',
      title: 'Efter løbeturen',
      items: [
        'Drik vand, når du er færdig, for at fylde depoterne op igen.',
        'Spis inden for 1–2 timer: kulhydrater + protein hjælper musklerne med at restituere — fx skyr med frugt, æg og brød, eller kylling og ris.',
        'En god nats søvn er en af de vigtigste dele af træningen.',
      ],
    },
    {
      icon: '⭐',
      title: 'Tommelfingerregler',
      items: [
        'Prøv aldrig helt ny mad før en vigtig tur — test det på de rolige dage.',
        'Løber du dårligt eller får ondt i maven, så juster timing og mængde næste gang.',
        'Er du i tvivl om kost i forhold til sygdom eller medicin, så tal med din læge.',
      ],
    },
  ],
  // History
  historyTitle: 'Historik',
  historyEmpty: 'Ingen gennemførte træninger endnu. Kom afsted! 👟',
  // Settings
  settingsTitle: 'Indstillinger',
  beeps: 'Bip-lyde',
  speechSetting: 'Talte beskeder',
  holdDuration: 'Hold-tid for knapper',
  holdDurationHint:
    'Hvor længe knapperne under en træning skal holdes inde, før de aktiverer. Længere tid = mindre risiko for tryk ved uheld.',
  holdSeconds: (s: string) => `${s} sek.`,
  dataTitle: 'Dine data',
  exportBtn: 'Eksportér data',
  importBtn: 'Importér data',
  importOk: 'Data importeret!',
  importError: 'Kunne ikke importere filen.',
  resetBtn: 'Nulstil fremskridt',
  confirmReset: 'Er du sikker? Alle gennemførte træninger slettes.',
  about: 'Kadens gemmer alt lokalt på din telefon — ingen konto, ingen sky.',
  // Install banner
  installTitle: 'Føj Kadens til hjemmeskærmen',
  installBodyIos: 'Tryk på Del-knappen og vælg “Føj til hjemmeskærm”. Så virker appen offline og gemmer dine data sikkert.',
  installBodyOther: 'Installér appen, så den virker offline og åbner som en rigtig app.',
  installBtn: 'Installér',
  installDismiss: 'Ikke nu',
}

export type Strings = typeof da

const LOCALES: Record<Language, Strings> = { da }

export function t(lang: Language = 'da'): Strings {
  return LOCALES[lang]
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.round(totalSeconds % 60)
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, '0')}`
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDate(iso: string, lang: Language = 'da'): string {
  void lang
  return new Date(iso).toLocaleDateString('da-DK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

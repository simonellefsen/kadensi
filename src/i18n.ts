import type { SegmentType } from './program'

export type Language = 'da' | 'en'

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'da', label: 'Dansk' },
  { code: 'en', label: 'English' },
]

/** Best-guess UI language from the browser, falling back to Danish. */
export function detectLanguage(): Language {
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of candidates) {
    if (tag?.toLowerCase().startsWith('en')) return 'en'
    if (tag?.toLowerCase().startsWith('da')) return 'da'
  }
  return 'da'
}

const da = {
  appName: 'KadensI',
  tagline: 'Find din kadens',
  // Share
  shareTitle: 'KadensI',
  shareText: 'KadensI hjælper dig i gang med at løbe — fra 0 til 5 km. Prøv den!',
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
  /** One entry per week, in `program.ts`'s `PROGRAM` order. */
  weekLabels: [
    '8 × (1 min løb / 1½ min gå)',
    '6 × (1½ min løb / 2 min gå)',
    '2 × (1½ min løb, 1½ min gå, 3 min løb, 3 min gå)',
    '3 min løb, 5 min løb, 3 min løb, 5 min løb — korte gåpauser',
    'Længere løb: 5-5-5 · 8-8 · 20 min',
    'Næsten i mål: 5-8-5 · 10-10 · 25 min = 3 km!',
    '25 min kontinuerligt løb',
    '28 min kontinuerligt løb',
    '30 min kontinuerligt løb',
    '30-32-35 min løb = 5 km!',
  ],
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
  languageSetting: 'Sprog',
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
  about: 'gemmer alt lokalt på din telefon — ingen konto, ingen sky.',
  // Install banner
  installLead: 'Føj ',
  installTitle: ' til hjemmeskærmen',
  installBodyIos:
    'Åbn siden i Safari. Tryk på Del-knappen, rul ned og vælg “Føj til hjemmeskærm”. Hvis punktet mangler, tryk “Rediger handlinger” nederst og slå det til. Så virker appen offline og gemmer dine data sikkert.',
  installBodyOther: 'Installér appen, så den virker offline og åbner som en rigtig app.',
  installBtn: 'Installér',
  installDismiss: 'Ikke nu',
}

export type Strings = typeof da

const en: Strings = {
  appName: 'KadensI',
  tagline: 'Find your cadence',
  // Share
  shareTitle: 'KadensI',
  shareText: 'KadensI helps you get started running — from 0 to 5K. Give it a try!',
  shareCopied: 'Link copied!',
  shareFailed: "Couldn't share.",
  // Navigation
  navHome: 'Plan',
  navAdvice: 'Advice',
  navHistory: 'History',
  navSettings: 'Settings',
  // Home
  nextSession: 'Next workout',
  week: 'Week',
  session: 'Workout',
  start: 'Start',
  minutes: 'min',
  totalTime: 'Total time',
  runTime: 'Running time',
  progress: 'Progress',
  programDone: "You've completed the whole programme! 🎉",
  milestone3km: '3K',
  milestone5km: '5K',
  completedBadge: 'Completed',
  weekLabels: [
    '8 × (1 min run / 1½ min walk)',
    '6 × (1½ min run / 2 min walk)',
    '2 × (1½ min run, 1½ min walk, 3 min run, 3 min walk)',
    '3 min run, 5 min run, 3 min run, 5 min run — short walk breaks',
    'Longer runs: 5-5-5 · 8-8 · 20 min',
    'Almost there: 5-8-5 · 10-10 · 25 min = 3K!',
    '25 min continuous running',
    '28 min continuous running',
    '30 min continuous running',
    '30-32-35 min running = 5K!',
  ],
  // Segments
  segment: {
    warmup: 'Warm-up',
    run: 'RUN',
    walk: 'WALK',
    cooldown: 'Cool-down',
  } satisfies Record<SegmentType, string>,
  // Session screen
  next: 'Next',
  pause: 'Pause',
  resume: 'Resume',
  skip: 'Skip',
  endSession: 'End',
  holdHint: 'Hold…',
  holdNote: "Hold a button down for a moment — so it won't trigger by accident in your pocket.",
  finished: 'Great run!',
  finishedBody: 'Workout completed and saved.',
  backToPlan: 'Back to plan',
  confirmEnd: 'End the workout without saving it as completed?',
  resumePrompt: 'You have a workout in progress. Resume it?',
  resumeYes: 'Resume workout',
  resumeNo: 'Discard',
  silentHint: 'Sound requires the ring/silent switch to be off silent',
  // Speech cues
  speech: {
    warmup: 'Warm-up. Walk easy.',
    run: 'Run now!',
    walk: 'Walk now.',
    cooldown: 'Cool-down. Walk easy.',
    halfway: 'Halfway there!',
    lastInterval: 'Last interval!',
    done: 'Well done! The workout is over.',
  },
  // Advice
  adviceTitle: 'Nutrition & hydration advice',
  adviceIntro:
    "Good habits around food and fluids make your run easier and your recovery better. This is general advice — experiment to find what works, since everyone's stomach is different.",
  adviceSections: [
    {
      icon: '🥣',
      title: 'Before the run',
      items: [
        'Eat a light meal 1½–3 hours before — mostly carbs with a little protein, e.g. oatmeal, wholegrain bread, or a banana.',
        'Avoid very fatty, fried, or high-fibre food right before — it can upset your stomach.',
        'Only got 30–60 minutes? Grab a small snack: a banana, a handful of raisins, or a date.',
        'Running in the morning? A short run works fine on an empty stomach — pay attention to what suits you.',
      ],
    },
    {
      icon: '💧',
      title: 'Hydration',
      items: [
        'Drink 300–500 ml of water 1–2 hours before, so you start well-hydrated without sloshing around.',
        'For runs under about 45–60 minutes, water is enough — drink to thirst, in small sips.',
        "If you've sweated a lot, get some salt in afterward (e.g. through food) to restore your balance.",
      ],
    },
    {
      icon: '🍽️',
      title: 'After the run',
      items: [
        "Drink water once you're done to top up your fluid stores.",
        'Eat within 1–2 hours: carbs plus protein help your muscles recover — e.g. skyr with fruit, eggs and bread, or chicken and rice.',
        "A good night's sleep is one of the most important parts of training.",
      ],
    },
    {
      icon: '⭐',
      title: 'Rules of thumb',
      items: [
        'Never try completely new food before an important run — test it on easy days instead.',
        'If a run goes badly or your stomach hurts, adjust the timing and amount next time.',
        "If you're unsure about diet related to illness or medication, talk to your doctor.",
      ],
    },
  ],
  // History
  historyTitle: 'History',
  historyEmpty: 'No completed workouts yet. Get going! 👟',
  // Settings
  settingsTitle: 'Settings',
  languageSetting: 'Language',
  beeps: 'Beep sounds',
  speechSetting: 'Spoken cues',
  holdDuration: 'Button hold duration',
  holdDurationHint:
    'How long the buttons during a workout must be held before they activate. Longer = less risk of accidental taps.',
  holdSeconds: (s: string) => `${s} sec`,
  dataTitle: 'Your data',
  exportBtn: 'Export data',
  importBtn: 'Import data',
  importOk: 'Data imported!',
  importError: 'Could not import the file.',
  resetBtn: 'Reset progress',
  confirmReset: 'Are you sure? All completed workouts will be deleted.',
  about: 'stores everything locally on your phone — no account, no cloud.',
  // Install banner
  installLead: 'Add ',
  installTitle: ' to your home screen',
  installBodyIos:
    'Open this page in Safari. Tap the Share button, scroll down and choose “Add to Home Screen”. If the option is missing, tap “Edit Actions” at the bottom and turn it on. This lets the app work offline and keeps your data safe.',
  installBodyOther: 'Install the app so it works offline and opens like a real app.',
  installBtn: 'Install',
  installDismiss: 'Not now',
}

const LOCALES: Record<Language, Strings> = { da, en }

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
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'da-DK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

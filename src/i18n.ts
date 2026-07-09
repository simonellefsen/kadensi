import type { SegmentType } from './program'

export type Language = 'da'

const da = {
  appName: 'Kadens',
  tagline: 'Find din kadens',
  // Navigation
  navHome: 'Plan',
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
  // History
  historyTitle: 'Historik',
  historyEmpty: 'Ingen gennemførte træninger endnu. Kom afsted! 👟',
  // Settings
  settingsTitle: 'Indstillinger',
  beeps: 'Bip-lyde',
  speechSetting: 'Talte beskeder',
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

export type SegmentType = 'warmup' | 'run' | 'walk' | 'cooldown'

export interface Segment {
  type: SegmentType
  seconds: number
}

export interface SessionDef {
  /** e.g. "1-2" = week 1, session 2 — stable id used for progress tracking */
  id: string
  week: number
  index: number // 1..3 within the week
  segments: Segment[]
}

export interface WeekDef {
  week: number
  /** Milestone reached by completing this week, if any */
  milestone?: '3km' | '5km'
  sessions: SessionDef[]
}

const W = (seconds: number): Segment => ({ type: 'warmup', seconds })
const R = (seconds: number): Segment => ({ type: 'run', seconds })
const G = (seconds: number): Segment => ({ type: 'walk', seconds })
const C = (seconds: number): Segment => ({ type: 'cooldown', seconds })

const MIN = 60

/** n repetitions of (run, walk) */
function reps(n: number, run: number, walk: number): Segment[] {
  const out: Segment[] = []
  for (let i = 0; i < n; i++) {
    out.push(R(run))
    if (i < n - 1) out.push(G(walk))
  }
  return out
}

function wrap(intervals: Segment[]): Segment[] {
  return [W(5 * MIN), ...intervals, C(5 * MIN)]
}

interface WeekSpec {
  milestone?: '3km' | '5km'
  /** One entry per session; identical sessions can share a builder */
  sessions: Segment[][]
}

const triple = (intervals: Segment[]): Segment[][] => [intervals, intervals, intervals]

/**
 * Displayed week descriptions (translated per locale) live in `i18n.ts`'s
 * `weekLabels`, in the same order as this array.
 */
const WEEK_SPECS: WeekSpec[] = [
  { sessions: triple(reps(8, MIN, 1.5 * MIN)) },
  { sessions: triple(reps(6, 1.5 * MIN, 2 * MIN)) },
  {
    sessions: triple([
      R(1.5 * MIN), G(1.5 * MIN), R(3 * MIN), G(3 * MIN),
      R(1.5 * MIN), G(1.5 * MIN), R(3 * MIN), G(3 * MIN),
    ]),
  },
  {
    sessions: triple([
      R(3 * MIN), G(1.5 * MIN), R(5 * MIN), G(2.5 * MIN), R(3 * MIN), G(1.5 * MIN), R(5 * MIN),
    ]),
  },
  {
    sessions: [
      [R(5 * MIN), G(3 * MIN), R(5 * MIN), G(3 * MIN), R(5 * MIN)],
      [R(8 * MIN), G(5 * MIN), R(8 * MIN)],
      [R(20 * MIN)],
    ],
  },
  {
    milestone: '3km',
    sessions: [
      [R(5 * MIN), G(3 * MIN), R(8 * MIN), G(3 * MIN), R(5 * MIN)],
      [R(10 * MIN), G(3 * MIN), R(10 * MIN)],
      [R(25 * MIN)],
    ],
  },
  { sessions: triple([R(25 * MIN)]) },
  { sessions: triple([R(28 * MIN)]) },
  { sessions: triple([R(30 * MIN)]) },
  {
    milestone: '5km',
    sessions: [[R(30 * MIN)], [R(32 * MIN)], [R(35 * MIN)]],
  },
]

export const PROGRAM: WeekDef[] = WEEK_SPECS.map((spec, wi) => {
  const week = wi + 1
  return {
    week,
    milestone: spec.milestone,
    sessions: spec.sessions.map((intervals, si) => ({
      id: `${week}-${si + 1}`,
      week,
      index: si + 1,
      segments: wrap(intervals),
    })),
  }
})

export const ALL_SESSIONS: SessionDef[] = PROGRAM.flatMap((w) => w.sessions)

export function sessionById(id: string): SessionDef | undefined {
  return ALL_SESSIONS.find((s) => s.id === id)
}

export function sessionDuration(s: SessionDef): number {
  return s.segments.reduce((sum, seg) => sum + seg.seconds, 0)
}

export function runDuration(s: SessionDef): number {
  return s.segments.filter((seg) => seg.type === 'run').reduce((sum, seg) => sum + seg.seconds, 0)
}

/** First session not yet completed, in program order */
export function nextSession(completedIds: ReadonlySet<string>): SessionDef | undefined {
  return ALL_SESSIONS.find((s) => !completedIds.has(s.id))
}

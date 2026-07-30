---
type: source-note
tags:
  - kadensi/audio
  - kadensi/device-test
updated: 2026-07-30
source: first-party product feedback and code investigation
---

# Source note: iPhone spoken-cue follow-up

On 2026-07-30, a runner reported occasionally not hearing the spoken
transition commands “Gå nu” or “Løb nu” during a workout. The report also
asked whether an accidental iPhone side-button press could be prevented.

## Investigation finding

`src/audio.ts` already contained `unlockAudio()`, which primes Web Audio and
speech synthesis only when called from an explicit user gesture. Before this
follow-up, neither the Start nor Resume handler in `src/App.tsx` called it.
That left iOS speech authorization/priming dependent on browser behaviour and
is a plausible cause of missing initial or transition announcements.

The fix calls `unlockAudio()` synchronously from both controls and resumes
speech synthesis before each new announcement. `src/App.test.tsx` covers both
user-gesture paths.

## Lock-screen boundary

The browser Wake Lock API can prevent automatic screen sleep while a workout
is active, but cannot block a deliberate physical iPhone side-button press.
Guided Access is the device-level option for temporarily disabling that button
for one app. This remains a manual user choice rather than an app capability.

## Follow-up required

Repeat the relevant real-iPhone release checks after deployment: first cue,
multiple run/walk transitions, resume after reload, and a session while the
device is in Low Power Mode. The earlier release pass remains useful evidence,
but it did not expose this intermittent report.

---
type: concept
tags:
  - kadensi/wiki
  - llm-wiki
updated: 2026-07-11
sources:
  - wiki/sources/llm-wiki.md
---

# LLM-maintained project wiki

KadensI follows the [LLM-wiki pattern](../sources/llm-wiki.md): a persistent,
compounding Markdown knowledge layer that agents maintain alongside the code.
It is not a second implementation and it is not a dumping ground for chat
transcripts.

## Why this project benefits

The difficult parts of KadensI are mostly platform and product constraints,
not backend complexity. They recur across work sessions:

- iOS installation, audio, wake-lock, and storage behaviour.
- Timestamp-based timer safety under browser throttling.
- Programme and local-storage compatibility decisions.
- Results from real-device, accessibility, and offline testing.

Without a maintained synthesis, each future agent must rediscover the same
constraints. With this wiki, a device test becomes a source, the architecture
records the durable conclusion, the release runbook gains the verification
step, and the roadmap records any remaining gap.

## Working loop

1. Capture a durable observation as a source note.
2. Link and synthesise it in the affected concept, architecture, runbook,
   decision, experiment, or roadmap page.
3. Update the index and append the maintenance action to the log.
4. Query the wiki before reopening a previous decision; verify it against code
   or a current device test if the claim may have drifted.

## Boundaries

- Preserve source notes; correct a synthesis page when a source is superseded.
- Do not record user backups, personal data, credentials, private URLs, or
  unredacted browser/device diagnostics.
- Separate facts, source-backed evidence, and proposals. A roadmap item is not
  an implemented feature.

See [the schema](../schema.md) for the full operating contract.

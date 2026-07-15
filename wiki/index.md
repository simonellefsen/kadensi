---
type: wiki-index
tags:
  - kadensi/wiki
  - maintained-by-llm
updated: 2026-07-11
---

# KadensI knowledge wiki

This index is the content map for KadensI's LLM-maintained project knowledge.
Future sessions should read it first for project history, architecture,
product direction, device validation, or maintenance work.

## Start here

- [schema](schema.md) — maintenance rules, page conventions, and workflows.
- [log](log.md) — append-only timeline of wiki operations.
- [architecture](architecture.md) — current browser, data, PWA, and deployment
  shape.
- [roadmap](roadmap.md) — priority work, evidence, scope, and open questions.
- [concepts/llm-maintained-project-wiki](concepts/llm-maintained-project-wiki.md)
  — why this project uses the LLM-wiki pattern.

## Source notes

- [sources/llm-wiki](sources/llm-wiki.md) — source note for Andrej Karpathy's
  LLM-wiki pattern, and how it applies to KadensI.
- [sources/device-test-2026-07-15-iphone17pro](sources/device-test-2026-07-15-iphone17pro.md)
  — real-iPhone release-pass result (iPhone 17 Pro, iOS 26.5.2), steps 1–7
  confirmed passing.

## Runbooks

- [runbooks/README](runbooks/README.md) — operational procedure catalog.
- [runbooks/build-test-release](runbooks/build-test-release.md) — local
  quality checks and iPhone release validation.

## Decisions and experiments

- [decisions/README](decisions/README.md) — architecture and workflow decision
  records.
- [experiments/README](experiments/README.md) — user and product experiment
  records, with hypotheses and evidence.

## Open questions

- Which real-device test matrix gives sufficient confidence across current iOS
  Safari versions and installed-PWA modes?
- Should programme variants be added, and what migration policy would keep
  saved progress meaningful?
- Which privacy-preserving user feedback mechanism, if any, would justify a
  future backend decision?

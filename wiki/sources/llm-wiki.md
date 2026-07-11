---
type: source-note
tags:
  - kadensi/wiki
  - llm-wiki
updated: 2026-07-11
source: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
author: Andrej Karpathy
---

# Source note: LLM wiki

Source: [karpathy/442a6bf555914893e9891c11519de94f](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

Credit: the original LLM-wiki idea is by Andrej Karpathy.

## Summary

The source proposes a persistent LLM-maintained Markdown wiki as an alternative
to repeatedly retrieving raw document chunks. An agent reads sources,
incrementally extracts durable knowledge, maintains interlinked synthesis
pages, resolves contradictions, and keeps the current understanding useful for
the next session.

Its three layers are:

- **Raw sources:** immutable documents and observations.
- **Wiki:** LLM-maintained concepts, summaries, runbooks, decisions, and
  comparisons.
- **Schema:** instructions that define the wiki structure and maintenance
  workflow for future agents.

The core operations are ingest, query, and lint. Useful navigation pages are a
content-oriented `index.md` and chronological append-only `log.md`. Local
Markdown tools such as qmd and Obsidian can support search and link checking.

## Application to KadensI

KadensI is small, but its most important knowledge is easy to lose across
sessions: iOS/PWA limitations, timer reliability decisions, local-storage
compatibility, real-device validation results, and programme changes. The wiki
preserves that learning without treating notes as a substitute for code or
device verification.

Future device-test records, user feedback, accessibility findings, and product
decisions should be captured as sources and linked to their synthesis pages.
The main implementation references remain [the project architecture](../architecture.md)
and the source tree.

## Links

- [wiki schema](../schema.md)
- [LLM-maintained project wiki](../concepts/llm-maintained-project-wiki.md)
- [project architecture](../architecture.md)

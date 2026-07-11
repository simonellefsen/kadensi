---
type: wiki-schema
tags:
  - kadensi/wiki
  - maintained-by-llm
updated: 2026-07-11
---

# Wiki schema

This file is the operating contract for agents maintaining the KadensI project
knowledge wiki.

## Layer rules

- **Raw sources** are immutable. Read, cite, and summarise them, but do not
  rewrite a captured source as part of later wiki maintenance.
- **The wiki** is maintained synthesis. Agents may create and update pages
  under `wiki/` as the code, product, and operational understanding evolves.
- **This schema** defines conventions and workflows. Update it when those
  workflows change.

## Page types

Use YAML frontmatter on maintained pages. Recommended `type` values are:

- `wiki-index`, `wiki-log`, `wiki-schema`, `source-note`
- `concept`, `architecture`, `roadmap`, `runbook`, `decision`, `experiment`

Example:

```yaml
---
type: concept
tags:
  - kadensi/pwa
updated: 2026-07-11
sources:
  - wiki/sources/llm-wiki.md
---
```

## Link rules

- Use relative links between wiki pages, such as
  `[architecture](architecture.md)`. They work in GitHub and Obsidian.
- Use absolute local paths only when linking a repository file outside `wiki/`.
- Prefer links to source code and sources over copied excerpts.
- Do not create unresolved links unless they deliberately represent an open
  task in the roadmap.

## Ingest workflow

When a new durable source appears — product feedback, a device-test result,
bug investigation, design reference, or external technical source:

1. Read and capture it in `wiki/sources/<source-name>.md` with attribution.
2. Update the affected architecture, concept, runbook, decision, or experiment
   page with a synthesis and source link.
3. Update `wiki/index.md` if the page is new or materially changed.
4. Append one dated entry to `wiki/log.md`.
5. If it changes product direction, update `wiki/roadmap.md`.

## Query workflow

1. Search `wiki/index.md` first.
2. Retrieve complete linked pages before making claims.
3. Use `rtk qmd search` or `rtk qmd query` after a local collection has been
   configured; otherwise use `rtk rg` over `wiki/`.
4. Cite the source note or code path supporting any claim.
5. File genuinely reusable knowledge back into the appropriate page and log it.

## Lint workflow

Periodically verify that:

- `wiki/index.md` lists every maintained page.
- `wiki/log.md` records each material maintenance pass.
- Architecture claims match the source and a current production build.
- Source notes are linked from the synthesis that uses them.
- The roadmap distinguishes landed work, proposals, and unknowns.
- No page contains exported user data, personal information, secrets, or
  private deployment URLs.
- GitHub/Obsidian have no important broken links or orphan pages.

Useful commands:

```sh
rtk rg -n "TODO|token|secret|password|private key|backup" wiki
rtk rg -n "\]\([^)]*\.md\)" wiki
rtk qmd search "KadensI session timer" -c kadensi-wiki -n 10
```
